import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";

import ActionMenu from "../components/ActionMenu";
import Board from "../components/Board";
import InfoPanel from "../components/InfoPanel";
import {
  BASE_CELLS,
  CELL_TYPES,
  getAllBoardPositions,
  getCellType,
  isSamePosition
} from "../data/board";
import { createInitialPieces, TEAM_THEME } from "../data/characters";
import {
  canMoveTo,
  canTunnelTo,
  clampEnergy,
  clonePieces,
  collapsePiece,
  formatPosition,
  getMarkerAtCell,
  getOpponentTeam,
  getPieceById,
  getPiecePositions,
  getReachableMoves,
  isAlive,
  isEnergyCell,
  isInAttackRange,
  isNearOwnBase,
  isOpponentBaseCell,
  isQuantumCell,
  manhattanDistance
} from "../utils/gameLogic";

function appendLog(log, message) {
  return [message, ...log].slice(0, 7);
}

function createInitialGame() {
  return {
    pieces: createInitialPieces(),
    currentTeam: "A",
    round: 1,
    scores: { A: 0, B: 0 },
    bases: {
      A: { hp: 6, maxHp: 6, guarded: false },
      B: { hp: 6, maxHp: 6, guarded: false }
    },
    selectedPieceId: "A-photon",
    selectedAction: null,
    movedThisTurn: false,
    actedThisTurn: false,
    gameOver: null,
    log: [
      "Team A beginnt. Waehle eine Figur, bewege sie und nutze eine Aktion."
    ]
  };
}

function cloneGame(game) {
  return {
    ...game,
    pieces: clonePieces(game.pieces),
    scores: { ...game.scores },
    bases: {
      A: { ...game.bases.A },
      B: { ...game.bases.B }
    },
    log: [...game.log],
    gameOver: game.gameOver ? { ...game.gameOver } : null
  };
}

function addLog(game, message) {
  game.log = appendLog(game.log, message);
}

function awardScore(game, team, points) {
  game.scores[team] += points;
}

function cleanupPieces(game) {
  const aliveIds = new Set(
    game.pieces.filter((piece) => isAlive(piece)).map((piece) => piece.id)
  );

  game.pieces.forEach((piece) => {
    if (piece.hp <= 0) {
      piece.hp = 0;
      piece.superposition = null;
      piece.entangledWith = null;
      return;
    }

    if (piece.entangledWith && !aliveIds.has(piece.entangledWith)) {
      piece.entangledWith = null;
    }
  });
}

function evaluateWinner(game) {
  if (game.bases.A.hp <= 0) {
    return { winner: "B", reason: "Basis A wurde zerstoert." };
  }

  if (game.bases.B.hp <= 0) {
    return { winner: "A", reason: "Basis B wurde zerstoert." };
  }

  if (game.scores.A >= 10) {
    return { winner: "A", reason: "Team A erreicht 10 Quantenpunkte." };
  }

  if (game.scores.B >= 10) {
    return { winner: "B", reason: "Team B erreicht 10 Quantenpunkte." };
  }

  if (!game.pieces.some((piece) => piece.team === "A" && isAlive(piece))) {
    return { winner: "B", reason: "Alle Figuren von Team A sind besiegt." };
  }

  if (!game.pieces.some((piece) => piece.team === "B" && isAlive(piece))) {
    return { winner: "A", reason: "Alle Figuren von Team B sind besiegt." };
  }

  return null;
}

function finalizeGameState(game) {
  cleanupPieces(game);
  const winner = evaluateWinner(game);

  if (winner && !game.gameOver) {
    game.gameOver = winner;
    addLog(game, `${TEAM_THEME[winner.winner].name} gewinnt. ${winner.reason}`);
  }

  return game;
}

function finishAction(game, { moved = false, acted = true } = {}) {
  game.movedThisTurn = game.movedThisTurn || moved;
  game.actedThisTurn = game.actedThisTurn || acted;
  game.selectedAction = null;
  return finalizeGameState(game);
}

function collapseIfNeeded(game, pieceId, reason = "Messung") {
  const piece = getPieceById(game.pieces, pieceId);

  if (!piece?.superposition) {
    return piece;
  }

  const result = collapsePiece(game.pieces, pieceId);
  game.pieces = result.pieces;
  const collapsedPiece = getPieceById(game.pieces, pieceId);
  addLog(
    game,
    `${reason}: ${piece.role} ${piece.team} kollabiert auf ${formatPosition(
      result.chosenPosition
    )}.`
  );

  return collapsedPiece;
}

function damagePiece(game, targetId, damage, sourceTeam) {
  const target = getPieceById(game.pieces, targetId);

  if (!target || !isAlive(target) || damage <= 0) {
    return;
  }

  target.hp = Math.max(0, target.hp - damage);
  addLog(game, `${target.role} ${target.team} nimmt ${damage} Schaden.`);

  if (target.hp === 0) {
    awardScore(game, sourceTeam, 2);
    addLog(game, `${target.role} ${target.team} ist besiegt. +2 Punkte.`);
  }

  if (target.entangledWith) {
    const partner = getPieceById(game.pieces, target.entangledWith);

    if (partner && isAlive(partner)) {
      partner.hp = Math.max(0, partner.hp - 1);
      addLog(
        game,
        `Verschraenkung: ${partner.role} ${partner.team} verliert 1 Leben.`
      );

      if (partner.hp === 0) {
        awardScore(game, sourceTeam, 2);
        addLog(game, `${partner.role} ${partner.team} ist besiegt. +2 Punkte.`);
      }
    }
  }
}

function damageBase(game, defenderTeam, attacker) {
  let damage = attacker.attack;

  if (game.bases[defenderTeam].guarded) {
    damage = Math.max(0, damage - 1);
    game.bases[defenderTeam].guarded = false;
    addLog(game, `Basis ${defenderTeam} blockt 1 Schaden durch Verteidigung.`);
  }

  game.bases[defenderTeam].hp = Math.max(
    0,
    game.bases[defenderTeam].hp - damage
  );
  addLog(game, `${attacker.role} greift Basis ${defenderTeam} an: ${damage} Schaden.`);
}

function firstAlivePieceId(pieces, team) {
  return pieces.find((piece) => piece.team === team && isAlive(piece))?.id ?? null;
}

export default function GameScreen({ onRestart, onBackToStart }) {
  const [game, setGame] = useState(createInitialGame);
  const { width } = useWindowDimensions();
  const isCompact = width < 700;
  const isWide = width >= 1020;
  const selectedPiece = getPieceById(game.pieces, game.selectedPieceId);

  const highlightedPositions = useMemo(() => {
    if (!selectedPiece || game.gameOver || !game.selectedAction) {
      return [];
    }

    if (game.selectedAction === "move") {
      return getReachableMoves(selectedPiece, game.pieces);
    }

    if (game.selectedAction === "superposition") {
      return getReachableMoves(selectedPiece, game.pieces).filter(
        (position) => !isSamePosition(position, selectedPiece.position)
      );
    }

    if (game.selectedAction === "tunnel") {
      return getAllBoardPositions().filter((position) =>
        canTunnelTo(selectedPiece, game.pieces, position)
      );
    }

    if (game.selectedAction === "attack") {
      const positions = [];

      game.pieces
        .filter((piece) => piece.team !== selectedPiece.team && isAlive(piece))
        .forEach((piece) => {
          getPiecePositions(piece).forEach((position) => {
            if (isInAttackRange(selectedPiece, position)) {
              positions.push(position);
            }
          });
        });

      BASE_CELLS[getOpponentTeam(selectedPiece.team)].forEach((position) => {
        if (isInAttackRange(selectedPiece, position)) {
          positions.push(position);
        }
      });

      return positions;
    }

    if (game.selectedAction === "measure") {
      return game.pieces
        .filter(
          (piece) =>
            piece.team !== selectedPiece.team && isAlive(piece) && piece.superposition
        )
        .flatMap((piece) =>
          piece.superposition.positions.filter(
            (position) => manhattanDistance(selectedPiece.position, position) <= 3
          )
        );
    }

    if (game.selectedAction === "entangle") {
      return game.pieces
        .filter(
          (piece) =>
            piece.team === selectedPiece.team &&
            piece.id !== selectedPiece.id &&
            isAlive(piece) &&
            !piece.superposition &&
            !piece.entangledWith
        )
        .map((piece) => piece.position)
        .filter(
          (position) => manhattanDistance(selectedPiece.position, position) <= 2
        );
    }

    return [];
  }, [game, selectedPiece]);

  const canStartAction = (next, piece, actionKey) => {
    if (!piece || piece.team !== next.currentTeam || !isAlive(piece)) {
      addLog(next, "Waehle zuerst eine aktive Figur deines Teams.");
      return false;
    }

    if (actionKey === "move" && (next.movedThisTurn || next.actedThisTurn)) {
      addLog(next, "Bewegung ist in diesem Zug nicht mehr moeglich.");
      return false;
    }

    if (actionKey !== "move" && next.actedThisTurn) {
      addLog(next, "Die Aktion fuer diesen Zug wurde bereits genutzt.");
      return false;
    }

    if (actionKey === "superposition") {
      if (piece.templateKey !== "photon") {
        addLog(next, "Nur das Photon nutzt Superposition in diesem Prototyp.");
        return false;
      }

      if (piece.quantumEnergy < 1) {
        addLog(next, "Superposition kostet 1 QE.");
        return false;
      }
    }

    if (actionKey === "tunnel") {
      if (piece.templateKey !== "electron") {
        addLog(next, "Nur das Elektron kann tunneln.");
        return false;
      }

      if (piece.quantumEnergy < 2) {
        addLog(next, "Tunneln kostet 2 QE.");
        return false;
      }
    }

    if (actionKey === "entangle") {
      if (piece.templateKey !== "quark") {
        addLog(next, "Nur das Quark kann Figuren verschraenken.");
        return false;
      }

      if (piece.quantumEnergy < 2) {
        addLog(next, "Verschraenkung kostet 2 QE.");
        return false;
      }
    }

    return true;
  };

  const performEnergy = (next, pieceId) => {
    const piece = getPieceById(next.pieces, pieceId);
    const cellType = getCellType(piece.position);

    if (cellType !== CELL_TYPES.ENERGY && cellType !== CELL_TYPES.QUANTUM) {
      addLog(next, "Energie sammeln geht nur auf Energie- oder Quantenfeldern.");
      return next;
    }

    const gain = cellType === CELL_TYPES.ENERGY ? 2 : 1;
    piece.quantumEnergy = clampEnergy(piece, piece.quantumEnergy + gain);
    awardScore(next, piece.team, 1);
    addLog(
      next,
      `${piece.role} sammelt ${gain} QE in ganzen Einheiten. +1 Punkt.`
    );

    if (piece.entangledWith) {
      const partner = getPieceById(next.pieces, piece.entangledWith);

      if (partner && isAlive(partner)) {
        partner.quantumEnergy = clampEnergy(
          partner,
          partner.quantumEnergy + 1
        );
        addLog(
          next,
          `Verschraenkung: ${partner.role} ${partner.team} erhaelt 1 QE.`
        );
      }
    }

    return finishAction(next, { acted: true });
  };

  const performDefend = (next, pieceId) => {
    const piece = getPieceById(next.pieces, pieceId);

    if (!isNearOwnBase(piece)) {
      addLog(next, "Basis schuetzen geht nur in oder neben der eigenen Basis.");
      return next;
    }

    next.bases[piece.team].hp = Math.min(
      next.bases[piece.team].maxHp,
      next.bases[piece.team].hp + 1
    );
    next.bases[piece.team].guarded = true;
    addLog(
      next,
      `${piece.role} schuetzt Basis ${piece.team}. Heilung +1, naechster Schaden -1.`
    );

    return finishAction(next, { acted: true });
  };

  const handleActionPress = (actionKey) => {
    setGame((previous) => {
      if (previous.gameOver) {
        return previous;
      }

      const next = cloneGame(previous);
      let piece = getPieceById(next.pieces, next.selectedPieceId);

      if (!canStartAction(next, piece, actionKey)) {
        return next;
      }

      piece = collapseIfNeeded(next, piece.id, "Eigene Aktion");

      if (actionKey === "energy") {
        return performEnergy(next, piece.id);
      }

      if (actionKey === "defend") {
        return performDefend(next, piece.id);
      }

      next.selectedAction = actionKey;
      addLog(next, `${piece.role}: Ziel fuer ${actionKey} waehlen.`);
      return next;
    });
  };

  const performMove = (next, piece, target) => {
    if (!canMoveTo(piece, next.pieces, target)) {
      addLog(next, "Dieses Feld ist fuer normale Bewegung nicht erreichbar.");
      return next;
    }

    piece.position = target;
    addLog(next, `${piece.role} zieht nach ${formatPosition(target)}.`);
    return finishAction(next, { moved: true, acted: false });
  };

  const performSuperposition = (next, piece, target) => {
    if (!canMoveTo(piece, next.pieces, target)) {
      addLog(next, "Superposition braucht ein erreichbares zweites Feld.");
      return next;
    }

    piece.quantumEnergy -= 1;
    piece.superposition = {
      positions: [
        { row: piece.position.row, col: piece.position.col },
        { row: target.row, col: target.col }
      ]
    };
    awardScore(next, piece.team, 1);
    addLog(
      next,
      `${piece.role} ist in Superposition: ${formatPosition(
        piece.superposition.positions[0]
      )} oder ${formatPosition(piece.superposition.positions[1])}. +1 Punkt.`
    );

    return finishAction(next, { moved: true, acted: true });
  };

  const performTunnel = (next, piece, target) => {
    if (!canTunnelTo(piece, next.pieces, target)) {
      addLog(next, "Tunneln braucht eine gerade Linie durch genau ein Hindernis.");
      return next;
    }

    piece.quantumEnergy -= 2;
    const success = Math.random() < 0.5;

    if (success) {
      piece.position = target;
      awardScore(next, piece.team, 1);
      addLog(
        next,
        `${piece.role} tunnelt erfolgreich nach ${formatPosition(target)}. +1 Punkt.`
      );
    } else {
      addLog(next, `${piece.role} versucht zu tunneln, bleibt aber am Ort.`);
    }

    return finishAction(next, { moved: true, acted: true });
  };

  const performAttack = (next, attacker, target) => {
    if (!isInAttackRange(attacker, target)) {
      addLog(next, "Das Ziel liegt ausser Reichweite.");
      return next;
    }

    let marker = getMarkerAtCell(
      next.pieces,
      target,
      (piece) => piece.team !== attacker.team
    );

    if (marker?.isGhost) {
      const attackedPieceId = marker.piece.id;
      const result = collapsePiece(next.pieces, attackedPieceId);
      next.pieces = result.pieces;
      addLog(
        next,
        `Angriff misst Superposition: ${marker.piece.role} kollabiert auf ${formatPosition(
          result.chosenPosition
        )}.`
      );

      if (!isSamePosition(result.chosenPosition, target)) {
        addLog(next, "Der Angriff verfehlt, weil der Zustand woanders kollabiert.");
        return finishAction(next, { acted: true });
      }

      marker = {
        piece: getPieceById(next.pieces, attackedPieceId),
        isGhost: false
      };
    }

    if (marker?.piece && isAlive(marker.piece)) {
      damagePiece(next, marker.piece.id, attacker.attack, attacker.team);
      return finishAction(next, { acted: true });
    }

    if (isOpponentBaseCell(target, attacker.team)) {
      damageBase(next, getOpponentTeam(attacker.team), attacker);
      return finishAction(next, { acted: true });
    }

    addLog(next, "Auf diesem Feld steht kein angreifbares Ziel.");
    return next;
  };

  const performMeasure = (next, observer, target) => {
    const measurementRange = Math.max(3, observer.range);

    if (manhattanDistance(observer.position, target) > measurementRange) {
      addLog(next, "Die Messung ist zu weit entfernt.");
      return next;
    }

    const marker = getMarkerAtCell(
      next.pieces,
      target,
      (piece) => piece.team !== observer.team && piece.superposition
    );

    if (!marker?.isGhost) {
      addLog(next, "Messung braucht eine gegnerische Superposition.");
      return next;
    }

    const result = collapsePiece(next.pieces, marker.piece.id);
    next.pieces = result.pieces;
    awardScore(next, observer.team, 1);
    addLog(
      next,
      `${observer.role} misst ${marker.piece.role}: Zustand kollabiert auf ${formatPosition(
        result.chosenPosition
      )}. +1 Punkt.`
    );

    return finishAction(next, { acted: true });
  };

  const performEntangle = (next, piece, target) => {
    const marker = getMarkerAtCell(
      next.pieces,
      target,
      (candidate) =>
        candidate.team === piece.team &&
        candidate.id !== piece.id &&
        !candidate.superposition
    );

    if (!marker?.piece || marker.piece.entangledWith) {
      addLog(next, "Waehle eine freie befreundete Figur ohne Superposition.");
      return next;
    }

    if (piece.entangledWith) {
      addLog(next, `${piece.role} ist bereits verschraenkt.`);
      return next;
    }

    if (manhattanDistance(piece.position, marker.piece.position) > 2) {
      addLog(next, "Verschraenkung hat Reichweite 2.");
      return next;
    }

    piece.quantumEnergy -= 2;
    piece.entangledWith = marker.piece.id;
    marker.piece.entangledWith = piece.id;
    awardScore(next, piece.team, 1);
    addLog(
      next,
      `${piece.role} und ${marker.piece.role} sind verschraenkt. +1 Punkt.`
    );

    return finishAction(next, { acted: true });
  };

  const handleTargetAction = (target) => {
    setGame((previous) => {
      if (previous.gameOver || !previous.selectedAction) {
        return previous;
      }

      const next = cloneGame(previous);
      const piece = getPieceById(next.pieces, next.selectedPieceId);

      if (!piece || !isAlive(piece)) {
        addLog(next, "Die gewaehlte Figur ist nicht mehr aktiv.");
        next.selectedAction = null;
        return next;
      }

      if (next.selectedAction === "move") {
        return performMove(next, piece, target);
      }

      if (next.selectedAction === "superposition") {
        return performSuperposition(next, piece, target);
      }

      if (next.selectedAction === "tunnel") {
        return performTunnel(next, piece, target);
      }

      if (next.selectedAction === "attack") {
        return performAttack(next, piece, target);
      }

      if (next.selectedAction === "measure") {
        return performMeasure(next, piece, target);
      }

      if (next.selectedAction === "entangle") {
        return performEntangle(next, piece, target);
      }

      return next;
    });
  };

  const handleCellPress = (position) => {
    if (game.gameOver) {
      return;
    }

    if (game.selectedAction) {
      handleTargetAction(position);
      return;
    }

    const ownMarker = getMarkerAtCell(
      game.pieces,
      position,
      (piece) => piece.team === game.currentTeam
    );

    if (ownMarker?.piece) {
      setGame((previous) => ({
        ...previous,
        selectedPieceId: ownMarker.piece.id,
        selectedAction: null
      }));
    }
  };

  const endTurn = () => {
    setGame((previous) => {
      if (previous.gameOver) {
        return previous;
      }

      const next = cloneGame(previous);
      const controllingQuantumField = next.pieces.some(
        (piece) =>
          piece.team === next.currentTeam &&
          isAlive(piece) &&
          !piece.superposition &&
          piece.position &&
          isQuantumCell(piece.position)
      );

      if (controllingQuantumField) {
        awardScore(next, next.currentTeam, 1);
        addLog(next, `Team ${next.currentTeam} kontrolliert ein Quantenfeld. +1 Punkt.`);
      }

      finalizeGameState(next);

      if (next.gameOver) {
        return next;
      }

      const nextTeam = getOpponentTeam(next.currentTeam);
      next.currentTeam = nextTeam;
      next.round += nextTeam === "A" ? 1 : 0;
      next.movedThisTurn = false;
      next.actedThisTurn = false;
      next.selectedAction = null;
      next.selectedPieceId = firstAlivePieceId(next.pieces, nextTeam);
      addLog(next, `Team ${nextTeam} ist am Zug.`);
      return next;
    });
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.scrollContent,
        isCompact && styles.scrollContentCompact
      ]}
    >
      <View style={[styles.screenHeader, isCompact && styles.screenHeaderCompact]}>
        <View style={styles.titleWrap}>
          <Text style={styles.kicker}>Statefall</Text>
          <Text style={[styles.title, isCompact && styles.titleCompact]}>
            Rundenbasierter Prototyp
          </Text>
        </View>
        <View style={styles.headerActions}>
          <Pressable onPress={onBackToStart} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Start</Text>
          </Pressable>
          <Pressable onPress={onRestart} style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Neu</Text>
          </Pressable>
        </View>
      </View>

      {game.gameOver ? (
        <View style={styles.winBanner}>
          <Text style={styles.winTitle}>Team {game.gameOver.winner} gewinnt</Text>
          <Text style={styles.winText}>{game.gameOver.reason}</Text>
        </View>
      ) : null}

      <View style={[styles.gameLayout, isWide && styles.gameLayoutWide]}>
        <Board
          pieces={game.pieces}
          selectedPiece={selectedPiece}
          highlightedPositions={highlightedPositions}
          onCellPress={handleCellPress}
          alignTop={isWide}
        />
        <View style={[styles.sideColumn, isWide && styles.sideColumnWide]}>
          <ActionMenu
            selectedPiece={selectedPiece}
            selectedAction={game.selectedAction}
            movedThisTurn={game.movedThisTurn}
            actedThisTurn={game.actedThisTurn}
            gameOver={Boolean(game.gameOver)}
            compact={isCompact}
            onActionPress={handleActionPress}
            onEndTurn={endTurn}
          />
          <InfoPanel
            game={game}
            selectedPiece={selectedPiece}
            selectedAction={game.selectedAction}
            compact={isCompact}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    backgroundColor: "#e8deca",
    flexGrow: 1,
    padding: 16
  },
  scrollContentCompact: {
    padding: 10
  },
  screenHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 14
  },
  screenHeaderCompact: {
    alignItems: "flex-start",
    gap: 10
  },
  titleWrap: {
    flex: 1,
    minWidth: 0
  },
  kicker: {
    color: "#756550",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
    textTransform: "uppercase"
  },
  title: {
    color: "#2f261d",
    fontSize: 26,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 31
  },
  titleCompact: {
    fontSize: 22,
    lineHeight: 27
  },
  headerActions: {
    flexDirection: "row",
    flexShrink: 0,
    gap: 8
  },
  secondaryButton: {
    backgroundColor: "#f7efdf",
    borderColor: "#c7b99f",
    borderRadius: 6,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9
  },
  secondaryButtonText: {
    color: "#4f4235",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0
  },
  winBanner: {
    backgroundColor: "#35473f",
    borderRadius: 8,
    marginBottom: 14,
    padding: 14
  },
  winTitle: {
    color: "#fffaf0",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0
  },
  winText: {
    color: "#e8deca",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 4
  },
  gameLayout: {
    gap: 16
  },
  gameLayoutWide: {
    alignItems: "flex-start",
    flexDirection: "row"
  },
  sideColumn: {
    gap: 14,
    minWidth: 0
  },
  sideColumnWide: {
    flex: 1,
    minWidth: 360
  }
});
