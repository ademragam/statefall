export const ABILITIES = {
  move: {
    label: "Bewegen",
    short: "Ziehe bis zur Bewegungszahl in orthogonalen Schritten.",
    physics:
      "Klassische Bewegung: Die Figur hat einen eindeutigen Ort auf dem Brett."
  },
  attack: {
    label: "Angreifen",
    short: "Fuege einer gegnerischen Figur oder Basis Schaden zu.",
    physics:
      "Ein Angriff auf eine Superposition wirkt zugleich als Messung."
  },
  superposition: {
    label: "Superposition",
    cost: 1,
    short:
      "Photon legt zwei moegliche Orte fest. Beim naechsten Messen entscheidet der Zufall.",
    physics:
      "Superposition bedeutet hier: Die Figur kann voruebergehend auf zwei moeglichen Feldern sein. Erst durch eine Messung kollabiert der Zustand."
  },
  measure: {
    label: "Messung",
    cost: 0,
    short:
      "Kollabiert eine gegnerische Superposition ohne Schaden, aber mit 1 Quantenpunkt.",
    physics:
      "Messung veraendert den Zustand: Aus zwei Moeglichkeiten wird ein tatsaechlicher Ort."
  },
  tunnel: {
    label: "Tunneleffekt",
    cost: 2,
    short:
      "Elektron versucht mit 50 Prozent Erfolg durch genau ein Hindernis zu ziehen.",
    physics:
      "Beim Tunneleffekt kann ein Teilchen eine Barriere passieren, obwohl es klassisch blockiert waere. Im Spiel entscheidet ein Muenzwurf."
  },
  entangle: {
    label: "Verschraenkung",
    cost: 2,
    short:
      "Quark verbindet sich mit einer befreundeten Figur. Energie- und Schadenseffekte werden geteilt.",
    physics:
      "Verschraenkung koppelt zwei Figuren: Eine Aktion an der einen Figur kann einen Effekt an der anderen ausloesen."
  },
  energy: {
    label: "Energie sammeln",
    short:
      "Sammle auf Energie- oder Quantenfeldern ganze Energieeinheiten.",
    physics:
      "Energiequantisierung: Energie kommt in zaehlbaren Portionen, nicht als beliebige Zwischenwerte."
  },
  defend: {
    label: "Basis schuetzen",
    short:
      "In oder neben der eigenen Basis: Basis heilt 1 Punkt und blockt den naechsten Schaden um 1.",
    physics:
      "Keine Quantenregel, sondern ein ruhiger strategischer Zug fuer das Brettspiel."
  }
};

export const BOARD_GAME_NOTES = [
  "Superposition: Zwei Holzmarker derselben Figur auf zwei Feldern platzieren.",
  "Messung: Muenze werfen. Kopf = erster Marker, Zahl = zweiter Marker.",
  "Tunneleffekt: Muenze werfen. Bei Erfolg darf das Elektron durch genau ein Hindernis ziehen.",
  "Energie: Kleine Holzscheiben als ganze Quantenenergie-Einheiten verwenden.",
  "Verschraenkung: Zwei Figuren mit einer Schnur- oder Ringmarkierung verbinden."
];
