export const TEAM_THEME = {
  A: {
    name: "Team A",
    main: "#315a73",
    soft: "#d7e2e5",
    dark: "#193543"
  },
  B: {
    name: "Team B",
    main: "#8a4c3a",
    soft: "#ead8cf",
    dark: "#4d281f"
  }
};

export const CHARACTER_TEMPLATES = {
  photon: {
    role: "Photon",
    symbol: "P",
    hp: 3,
    attack: 1,
    range: 3,
    movement: 3,
    quantumEnergy: 2,
    maxQuantumEnergy: 5,
    rulesText:
      "Schnelle Fernkampf-Figur. Gut fuer Reichweite und Superposition."
  },
  electron: {
    role: "Elektron",
    symbol: "e",
    hp: 4,
    attack: 1,
    range: 2,
    movement: 3,
    quantumEnergy: 2,
    maxQuantumEnergy: 5,
    rulesText:
      "Flexible Figur. Sammelt Energie solide und kann durch Hindernisse tunneln."
  },
  quark: {
    role: "Quark",
    symbol: "q",
    hp: 5,
    attack: 2,
    range: 1,
    movement: 2,
    quantumEnergy: 1,
    maxQuantumEnergy: 4,
    rulesText:
      "Stabile Nahkampf-Figur. Schuetzt die Basis und kann Figuren verschraenken."
  }
};

function createPiece(id, team, templateKey, position) {
  const template = CHARACTER_TEMPLATES[templateKey];

  return {
    id,
    team,
    templateKey,
    name: `${template.role} ${team}`,
    role: template.role,
    symbol: template.symbol,
    hp: template.hp,
    maxHp: template.hp,
    attack: template.attack,
    range: template.range,
    movement: template.movement,
    quantumEnergy: template.quantumEnergy,
    maxQuantumEnergy: template.maxQuantumEnergy,
    position,
    superposition: null,
    entangledWith: null
  };
}

export function createInitialPieces() {
  return [
    createPiece("A-photon", "A", "photon", { row: 7, col: 1 }),
    createPiece("A-electron", "A", "electron", { row: 7, col: 3 }),
    createPiece("A-quark", "A", "quark", { row: 7, col: 6 }),
    createPiece("B-photon", "B", "photon", { row: 0, col: 6 }),
    createPiece("B-electron", "B", "electron", { row: 0, col: 4 }),
    createPiece("B-quark", "B", "quark", { row: 0, col: 1 })
  ];
}
