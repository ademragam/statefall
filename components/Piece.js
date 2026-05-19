import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { TEAM_THEME } from "../data/characters";

export default function Piece({ marker, cellSize, isSelected }) {
  const { piece, isGhost, optionIndex } = marker;
  const theme = TEAM_THEME[piece.team];
  const size = Math.max(24, cellSize * 0.58);

  return (
    <View
      style={[
        styles.token,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.main,
          borderColor: isSelected ? "#f4d35e" : theme.dark,
          opacity: isGhost ? 0.52 : 1
        },
        isGhost && styles.ghostToken,
        isSelected && styles.selectedToken
      ]}
    >
      <Text style={[styles.symbol, { fontSize: Math.max(13, size * 0.42) }]}>
        {piece.symbol}
      </Text>
      <View style={styles.statPill}>
        <Text style={styles.statText}>{piece.hp}</Text>
      </View>
      {piece.entangledWith ? (
        <View style={styles.entangledPill}>
          <Text style={styles.entangledText}>link</Text>
        </View>
      ) : null}
      {isGhost ? (
        <Text style={styles.optionText}>{optionIndex === 0 ? "1" : "2"}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  token: {
    alignItems: "center",
    borderWidth: 2,
    justifyContent: "center",
    shadowColor: "#2d251d",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.24,
    shadowRadius: 3
  },
  ghostToken: {
    borderStyle: "dashed"
  },
  selectedToken: {
    shadowOpacity: 0.42,
    shadowRadius: 6
  },
  symbol: {
    color: "#fbf7ef",
    fontWeight: "800",
    letterSpacing: 0
  },
  statPill: {
    alignItems: "center",
    backgroundColor: "#f8f1df",
    borderRadius: 8,
    bottom: -2,
    minWidth: 16,
    paddingHorizontal: 4,
    position: "absolute",
    right: -3
  },
  statText: {
    color: "#33291f",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0
  },
  entangledPill: {
    backgroundColor: "#2f2a24",
    borderRadius: 7,
    left: -8,
    paddingHorizontal: 3,
    position: "absolute",
    top: -5
  },
  entangledText: {
    color: "#f7efe1",
    fontSize: 7,
    fontWeight: "700",
    letterSpacing: 0
  },
  optionText: {
    bottom: 2,
    color: "#fffaf0",
    fontSize: 8,
    fontWeight: "800",
    left: 5,
    position: "absolute"
  }
});
