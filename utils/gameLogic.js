import {
  BASE_CELLS,
  BOARD_SIZE,
  CELL_TYPES,
  getBaseTeamAt,
  getCellType,
  isSamePosition
} from "../data/board";

export function positionKey(position) {
  return `${position.row}:${position.col}`;
}

export function isInsideBoard(position) {
  return (
    position.row >= 0 &&
    position.col >= 0 &&
    position.row < BOARD_SIZE &&
    position.col < BOARD_SIZE
  );
}

export function manhattanDistance(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

export function clonePosition(position) {
  return position ? { row: position.row, col: position.col } : null;
}

export function clonePiece(piece) {
  return {
    ...piece,
    position: clonePosition(piece.position),
    superposition: piece.superposition
      ? {
          positions: piece.superposition.positions.map(clonePosition)
        }
      : null
  };
}

export function clonePieces(pieces) {
  return pieces.map(clonePiece);
}

export function isAlive(piece) {
  return piece.hp > 0;
}

export function getPieceById(pieces, pieceId) {
  return pieces.find((piece) => piece.id === pieceId) ?? null;
}

export function getPiecePositions(piece) {
  if (!piece || !isAlive(piece)) {
    return [];
  }

  if (piece.superposition) {
    return piece.superposition.positions;
  }

  return piece.position ? [piece.position] : [];
}

export function getPiecesAtCell(pieces, position) {
  const markers = [];

  pieces.forEach((piece) => {
    if (!isAlive(piece)) {
      return;
    }

    if (piece.superposition) {
      piece.superposition.positions.forEach((possiblePosition, optionIndex) => {
        if (isSamePosition(possiblePosition, position)) {
          markers.push({ piece, isGhost: true, optionIndex });
        }
      });
      return;
    }

    if (isSamePosition(piece.position, position)) {
      markers.push({ piece, isGhost: false, optionIndex: null });
    }
  });

  return markers;
}

export function getMarkerAtCell(pieces, position, predicate = () => true) {
  return getPiecesAtCell(pieces, position).find(({ piece }) => predicate(piece)) ?? null;
}

export function isObstacle(position) {
  return getCellType(position) === CELL_TYPES.OBSTACLE;
}

export function isCellOccupied(pieces, position, excludedPieceId = null) {
  return pieces.some((piece) => {
    if (!isAlive(piece) || piece.id === excludedPieceId) {
      return false;
    }

    return getPiecePositions(piece).some((piecePosition) =>
      isSamePosition(piecePosition, position)
    );
  });
}

export function isBlockedForMovement(position, pieces, movingPieceId) {
  return (
    !isInsideBoard(position) ||
    isObstacle(position) ||
    isCellOccupied(pieces, position, movingPieceId)
  );
}

export function getReachableMoves(piece, pieces) {
  if (!piece || !piece.position || !isAlive(piece)) {
    return [];
  }

  const directions = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 }
  ];
  const visited = new Map([[positionKey(piece.position), 0]]);
  const queue = [piece.position];
  const reachable = [];

  while (queue.length > 0) {
    const current = queue.shift();
    const distance = visited.get(positionKey(current));

    if (distance >= piece.movement) {
      continue;
    }

    directions.forEach((direction) => {
      const next = {
        row: current.row + direction.row,
        col: current.col + direction.col
      };
      const key = positionKey(next);

      if (visited.has(key) || isBlockedForMovement(next, pieces, piece.id)) {
        return;
      }

      visited.set(key, distance + 1);
      reachable.push(next);
      queue.push(next);
    });
  }

  return reachable;
}

export function canMoveTo(piece, pieces, target) {
  return getReachableMoves(piece, pieces).some((position) =>
    isSamePosition(position, target)
  );
}

function getObstacleCountBetween(start, target) {
  if (start.row !== target.row && start.col !== target.col) {
    return Number.POSITIVE_INFINITY;
  }

  const rowStep = Math.sign(target.row - start.row);
  const colStep = Math.sign(target.col - start.col);
  let current = { row: start.row + rowStep, col: start.col + colStep };
  let obstacles = 0;

  while (!isSamePosition(current, target)) {
    if (isObstacle(current)) {
      obstacles += 1;
    }

    current = {
      row: current.row + rowStep,
      col: current.col + colStep
    };
  }

  return obstacles;
}

export function canTunnelTo(piece, pieces, target) {
  if (!piece || !piece.position || !isAlive(piece) || !isInsideBoard(target)) {
    return false;
  }

  if (piece.templateKey !== "electron") {
    return false;
  }

  if (isSamePosition(piece.position, target) || isObstacle(target)) {
    return false;
  }

  if (isCellOccupied(pieces, target, piece.id)) {
    return false;
  }

  const distance = manhattanDistance(piece.position, target);
  const isStraightLine =
    piece.position.row === target.row || piece.position.col === target.col;

  return (
    isStraightLine &&
    distance <= piece.movement + 2 &&
    getObstacleCountBetween(piece.position, target) === 1
  );
}

export function isInAttackRange(attacker, targetPosition) {
  return (
    attacker?.position &&
    manhattanDistance(attacker.position, targetPosition) <= attacker.range
  );
}

export function isNearOwnBase(piece) {
  if (!piece?.position) {
    return false;
  }

  return BASE_CELLS[piece.team].some(
    (baseCell) => manhattanDistance(baseCell, piece.position) <= 1
  );
}

export function collapsePiece(pieces, pieceId) {
  const piece = getPieceById(pieces, pieceId);

  if (!piece?.superposition) {
    return {
      pieces,
      chosenPosition: piece?.position ?? null,
      chosenIndex: null
    };
  }

  const chosenIndex = Math.random() < 0.5 ? 0 : 1;
  const chosenPosition = clonePosition(piece.superposition.positions[chosenIndex]);
  const nextPieces = pieces.map((currentPiece) =>
    currentPiece.id === pieceId
      ? {
          ...currentPiece,
          position: chosenPosition,
          superposition: null
        }
      : currentPiece
  );

  return { pieces: nextPieces, chosenPosition, chosenIndex };
}

export function clampEnergy(piece, value) {
  return Math.max(0, Math.min(piece.maxQuantumEnergy, value));
}

export function getOpponentTeam(team) {
  return team === "A" ? "B" : "A";
}

export function isOpponentBaseCell(position, team) {
  const baseTeam = getBaseTeamAt(position);
  return Boolean(baseTeam && baseTeam !== team);
}

export function isQuantumCell(position) {
  return getCellType(position) === CELL_TYPES.QUANTUM;
}

export function isEnergyCell(position) {
  return getCellType(position) === CELL_TYPES.ENERGY;
}

export function isPositionInList(position, positions) {
  return positions.some((candidate) => isSamePosition(candidate, position));
}

export function formatPosition(position) {
  return `${String.fromCharCode(65 + position.col)}${position.row + 1}`;
}
