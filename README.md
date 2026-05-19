# Statefall

Ein kleiner React-Native/Expo-Prototyp fuer ein rundenbasiertes Strategiespiel
mit Quantenphysik-Regeln. Das Spiel ist bewusst einfach gehalten, damit es auch
als echtes Holzbrettspiel fuer den Physikunterricht funktionieren kann.

## Idee

Zwei Teams spielen auf einem 8x8-Raster gegeneinander. Jedes Team steuert drei
Figuren: Photon, Elektron und Quark. Gewonnen wird, wenn eine Basis zerstoert
wird, ein Team 10 Quantenpunkte erreicht oder alle gegnerischen Figuren besiegt
sind.

Der Stil ist ruhig und brettspielnah: Holz, Papier, klare Marker, kleine Zahlen.
Keine Echtzeit, keine ueberladene Sci-Fi-Optik.

## Features

- Startscreen und spielbares 8x8-Brett
- Team A gegen Team B
- drei Figuren pro Team
- rundenbasierte Bewegung und Angriffe
- Quantenenergie als Ressource
- Quantenpunkte als Siegbedingung
- Basis-Leben und Basis-Verteidigung
- einfache Siegbedingungen
- kurze Erklaerungen zu den Physikbegriffen

## Quantenmechaniken

- **Superposition:** Das Photon kann fuer 1 QE zwei moegliche Positionen haben.
- **Messung:** Eine Superposition kollabiert zufaellig auf eine der Positionen.
- **Tunneleffekt:** Das Elektron kann fuer 2 QE mit 50 Prozent Chance durch ein
  Hindernis ziehen.
- **Verschraenkung:** Das Quark kann zwei befreundete Figuren koppeln. Energie-
  und Schadenseffekte koennen dadurch geteilt werden.
- **Energiequantisierung:** Quantenenergie wird nur in ganzen Einheiten
  gesammelt und ausgegeben.

## Figuren

| Figur | Leben | Angriff | Reichweite | Bewegung | Start-QE |
| --- | ---: | ---: | ---: | ---: | ---: |
| Photon | 3 | 1 | 3 | 3 | 2 |
| Elektron | 4 | 1 | 2 | 3 | 2 |
| Quark | 5 | 2 | 1 | 2 | 1 |

## Projektstruktur

```txt
components/
  ActionMenu.js
  Board.js
  Cell.js
  InfoPanel.js
  Piece.js
data/
  board.js
  characters.js
  quantumAbilities.js
screens/
  GameScreen.js
  StartScreen.js
utils/
  gameLogic.js
App.js
```

## Starten

```bash
npm install
npm run web
```

Auf Windows mit gesperrten PowerShell-Skripten:

```powershell
npm.cmd install
npm.cmd run web
```

## Web-Build

```bash
npx expo export --platform web --output-dir dist
```

Auf Windows:

```powershell
npx.cmd expo export --platform web --output-dir dist
```

## Holzbrettspiel-Idee

- 8x8-Holzbrett mit markierten Basis-, Energie-, Quanten- und Hindernisfeldern
- drei Holzfiguren pro Team
- kleine Scheiben fuer Quantenenergie
- Zaehlerleiste fuer Quantenpunkte
- zwei Marker fuer Superposition
- Muenze fuer Messung und Tunneleffekt
- Ring oder Schnurmarker fuer Verschraenkung

## Tech

- React Native
- Expo
- JavaScript
- lucide-react-native
