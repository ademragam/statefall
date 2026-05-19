import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { TEAM_THEME } from "../data/characters";
import { ABILITIES } from "../data/quantumAbilities";

function Meter({ label, value, max, color }) {
  const width = `${Math.max(0, Math.min(1, value / max)) * 100}%`;

  return (
    <View style={styles.meterBlock}>
      <View style={styles.meterLabelRow}>
        <Text style={styles.meterLabel}>{label}</Text>
        <Text style={styles.meterValue}>
          {value}/{max}
        </Text>
      </View>
      <View style={styles.meterTrack}>
        <View style={[styles.meterFill, { width, backgroundColor: color }]} />
      </View>
    </View>
  );
}

function PieceRow({ piece }) {
  const theme = TEAM_THEME[piece.team];

  return (
    <View style={styles.pieceRow}>
      <View style={[styles.pieceDot, { backgroundColor: theme.main }]}>
        <Text style={styles.pieceDotText}>{piece.symbol}</Text>
      </View>
      <View style={styles.pieceRowTextWrap}>
        <Text style={styles.pieceName}>{piece.role}</Text>
        <Text style={styles.pieceStats}>
          LP {piece.hp}/{piece.maxHp} · QE {piece.quantumEnergy}
          {piece.superposition ? " · superpos." : ""}
          {piece.entangledWith ? " · link" : ""}
        </Text>
      </View>
    </View>
  );
}

export default function InfoPanel({
  game,
  selectedPiece,
  selectedAction,
  compact = false
}) {
  const activeAbility =
    selectedAction && ABILITIES[selectedAction] ? ABILITIES[selectedAction] : null;
  const selectedTheme = selectedPiece ? TEAM_THEME[selectedPiece.team] : null;

  return (
    <View style={[styles.panel, compact && styles.panelCompact]}>
      <View style={styles.topStats}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Team</Text>
          <Text
            style={[
              styles.statValue,
              { color: TEAM_THEME[game.currentTeam].main }
            ]}
          >
            {game.currentTeam}
          </Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Runde</Text>
          <Text style={styles.statValue}>{game.round}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Punkte</Text>
          <Text style={styles.statValue}>
            {game.scores.A}:{game.scores.B}
          </Text>
        </View>
      </View>

      <View style={styles.baseGrid}>
        <Meter
          label="Basis A"
          value={game.bases.A.hp}
          max={game.bases.A.maxHp}
          color={TEAM_THEME.A.main}
        />
        <Meter
          label="Basis B"
          value={game.bases.B.hp}
          max={game.bases.B.maxHp}
          color={TEAM_THEME.B.main}
        />
      </View>

      {selectedPiece ? (
        <View style={styles.selectedBox}>
          <View style={styles.selectedHeader}>
            <View
              style={[
                styles.selectedToken,
                { backgroundColor: selectedTheme.main }
              ]}
            >
              <Text style={styles.selectedTokenText}>{selectedPiece.symbol}</Text>
            </View>
            <View>
              <Text style={styles.selectedTitle}>{selectedPiece.role}</Text>
              <Text style={styles.selectedSubline}>Team {selectedPiece.team}</Text>
            </View>
          </View>
          <View style={styles.attributeGrid}>
            <Text style={styles.attribute}>LP {selectedPiece.hp}</Text>
            <Text style={styles.attribute}>ATK {selectedPiece.attack}</Text>
            <Text style={styles.attribute}>RW {selectedPiece.range}</Text>
            <Text style={styles.attribute}>BW {selectedPiece.movement}</Text>
            <Text style={styles.attribute}>QE {selectedPiece.quantumEnergy}</Text>
          </View>
        </View>
      ) : null}

      <View style={styles.conceptBox}>
        <Text style={styles.sectionTitle}>Physik kurz</Text>
        <Text style={styles.conceptText}>
          {activeAbility
            ? activeAbility.physics
            : "Waehle eine Aktion, um den passenden Quantenbegriff zu sehen."}
        </Text>
      </View>

      <View style={[styles.teamListGrid, compact && styles.teamListGridCompact]}>
        <View style={styles.teamList}>
          <Text style={styles.sectionTitle}>Team A</Text>
          {game.pieces
            .filter((piece) => piece.team === "A")
            .map((piece) => (
              <PieceRow key={piece.id} piece={piece} />
            ))}
        </View>
        <View style={styles.teamList}>
          <Text style={styles.sectionTitle}>Team B</Text>
          {game.pieces
            .filter((piece) => piece.team === "B")
            .map((piece) => (
              <PieceRow key={piece.id} piece={piece} />
            ))}
        </View>
      </View>

      <View style={styles.logBox}>
        <Text style={styles.sectionTitle}>Zugprotokoll</Text>
        {game.log.map((entry, index) => (
          <Text key={`${entry}-${index}`} style={styles.logLine}>
            {entry}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: "#f7efdf",
    borderColor: "#c7b99f",
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 14
  },
  panelCompact: {
    padding: 10
  },
  topStats: {
    flexDirection: "row",
    gap: 8
  },
  statBox: {
    backgroundColor: "#ebe0cb",
    borderRadius: 6,
    flex: 1,
    padding: 10
  },
  statLabel: {
    color: "#7a6a56",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0,
    textTransform: "uppercase"
  },
  statValue: {
    color: "#2f261d",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 0,
    marginTop: 2
  },
  baseGrid: {
    gap: 9
  },
  meterBlock: {
    gap: 5
  },
  meterLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between"
  },
  meterLabel: {
    color: "#4f4235",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0
  },
  meterValue: {
    color: "#4f4235",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0
  },
  meterTrack: {
    backgroundColor: "#ded0b9",
    borderRadius: 99,
    height: 8,
    overflow: "hidden"
  },
  meterFill: {
    borderRadius: 99,
    height: 8
  },
  selectedBox: {
    backgroundColor: "#fff8eb",
    borderColor: "#d0c0a4",
    borderRadius: 8,
    borderWidth: 1,
    padding: 12
  },
  selectedHeader: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10
  },
  selectedToken: {
    alignItems: "center",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40
  },
  selectedTokenText: {
    color: "#fffaf0",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0
  },
  selectedTitle: {
    color: "#2f261d",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 0
  },
  selectedSubline: {
    color: "#7a6a56",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0
  },
  attributeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
    marginTop: 10
  },
  attribute: {
    backgroundColor: "#ece0cc",
    borderRadius: 5,
    color: "#44362a",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0,
    paddingHorizontal: 8,
    paddingVertical: 5
  },
  conceptBox: {
    backgroundColor: "#e4ebdf",
    borderRadius: 8,
    padding: 12
  },
  sectionTitle: {
    color: "#2f261d",
    fontSize: 13,
    fontWeight: "900",
    letterSpacing: 0,
    marginBottom: 6
  },
  conceptText: {
    color: "#40534d",
    fontSize: 13,
    lineHeight: 19
  },
  teamListGrid: {
    flexDirection: "row",
    gap: 10
  },
  teamListGridCompact: {
    flexDirection: "column",
    gap: 4
  },
  teamList: {
    flex: 1
  },
  pieceRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 7,
    marginBottom: 7
  },
  pieceDot: {
    alignItems: "center",
    borderRadius: 13,
    height: 26,
    justifyContent: "center",
    width: 26
  },
  pieceDotText: {
    color: "#fffaf0",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0
  },
  pieceRowTextWrap: {
    flex: 1
  },
  pieceName: {
    color: "#2f261d",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0
  },
  pieceStats: {
    color: "#6d5f50",
    fontSize: 11,
    lineHeight: 15
  },
  logBox: {
    backgroundColor: "#efe4d1",
    borderRadius: 8,
    padding: 10
  },
  logLine: {
    color: "#5a4a3b",
    fontSize: 12,
    lineHeight: 17,
    marginBottom: 3
  }
});
