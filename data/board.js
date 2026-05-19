export const BOARD_SIZE = 8;

export const CELL_TYPES = {
  NEUTRAL: "neutral",
  BASE_A: "baseA",
  BASE_B: "baseB",
  QUANTUM: "quantum",
  OBSTACLE: "obstacle",
  ENERGY: "energy"
};

export const BASE_CELLS = {
  A: [
    { row: 7, col: 2 },
    { row: 7, col: 3 },
    { row: 7, col: 4 },
    { row: 7, col: 5 }
  ],
  B: [
    { row: 0, col: 2 },
    { row: 0, col: 3 },
    { row: 0, col: 4 },
    { row: 0, col: 5 }
  ]
};

export const SPECIAL_CELLS = [
  { row: 1, col: 1, type: CELL_TYPES.QUANTUM },
  { row: 1, col: 6, type: CELL_TYPES.ENERGY },
  { row: 2, col: 2, type: CELL_TYPES.ENERGY },
  { row: 2, col: 5, type: CELL_TYPES.OBSTACLE },
  { row: 3, col: 0, type: CELL_TYPES.QUANTUM },
  { row: 3, col: 3, type: CELL_TYPES.OBSTACLE },
  { row: 3, col: 6, type: CELL_TYPES.QUANTUM },
  { row: 4, col: 1, type: CELL_TYPES.QUANTUM },
  { row: 4, col: 4, type: CELL_TYPES.OBSTACLE },
  { row: 4, col: 7, type: CELL_TYPES.QUANTUM },
  { row: 5, col: 2, type: CELL_TYPES.OBSTACLE },
  { row: 5, col: 5, type: CELL_TYPES.ENERGY },
  { row: 6, col: 1, type: CELL_TYPES.ENERGY },
  { row: 6, col: 6, type: CELL_TYPES.QUANTUM }
];

export const CELL_COPY = {
  [CELL_TYPES.NEUTRAL]: {
    title: "Neutrales Feld",
    short: "Freies Feld ohne Zusatzregel."
  },
  [CELL_TYPES.BASE_A]: {
    title: "Basis A",
    short: "Team A verteidigt diese Felder."
  },
  [CELL_TYPES.BASE_B]: {
    title: "Basis B",
    short: "Team B verteidigt diese Felder."
  },
  [CELL_TYPES.QUANTUM]: {
    title: "Quantenfeld",
    short: "Kontrolle am Zugende gibt 1 Quantenpunkt."
  },
  [CELL_TYPES.OBSTACLE]: {
    title: "Hindernis",
    short: "Blockiert Bewegung. Elektronen koennen hindurch tunneln."
  },
  [CELL_TYPES.ENERGY]: {
    title: "Energiequelle",
    short: "Hier kann eine Figur ganze Quantenenergie-Einheiten sammeln."
  }
};

export function isSamePosition(a, b) {
  return Boolean(a && b && a.row === b.row && a.col === b.col);
}

export function getCellType(position) {
  if (BASE_CELLS.A.some((cell) => isSamePosition(cell, position))) {
    return CELL_TYPES.BASE_A;
  }

  if (BASE_CELLS.B.some((cell) => isSamePosition(cell, position))) {
    return CELL_TYPES.BASE_B;
  }

  return (
    SPECIAL_CELLS.find((cell) => isSamePosition(cell, position))?.type ??
    CELL_TYPES.NEUTRAL
  );
}

export function getBaseTeamAt(position) {
  if (BASE_CELLS.A.some((cell) => isSamePosition(cell, position))) {
    return "A";
  }

  if (BASE_CELLS.B.some((cell) => isSamePosition(cell, position))) {
    return "B";
  }

  return null;
}

export function getAllBoardPositions() {
  const positions = [];

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      positions.push({ row, col });
    }
  }

  return positions;
}
