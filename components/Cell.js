import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Lucide from "lucide-react-native";

import { CELL_TYPES } from "../data/board";
import Piece from "./Piece";

function TerrainIcon({ type, size }) {
  const iconSize = Math.max(13, size * 0.24);
  const common = {
    size: iconSize,
    strokeWidth: 2.3
  };

  if (type === CELL_TYPES.ENERGY) {
    const Icon = Lucide.Zap ?? Lucide.Circle;
    return <Icon {...common} color="#795d20" />;
  }

  if (type === CELL_TYPES.QUANTUM) {
    const Icon = Lucide.Atom ?? Lucide.CircleDot ?? Lucide.Circle;
    return <Icon {...common} color="#3d6255" />;
  }

  if (type === CELL_TYPES.OBSTACLE) {
    const Icon = Lucide.Box ?? Lucide.Square;
    return <Icon {...common} color="#5d554b" />;
  }

  if (type === CELL_TYPES.BASE_A || type === CELL_TYPES.BASE_B) {
    const Icon = Lucide.Home ?? Lucide.Square;
    return <Icon {...common} color="#4b3c2e" />;
  }

  return null;
}

export default function Cell({
  position,
  type,
  markers,
  cellSize,
  isHighlighted,
  isSelected,
  onPress
}) {
  return (
    <Pressable
      accessibilityLabel={`Feld ${position.row + 1}, ${position.col + 1}`}
      onPress={onPress}
      style={[
        styles.cell,
        cellStyleByType[type],
        {
          width: cellSize,
          height: cellSize
        },
        isHighlighted && styles.highlighted,
        isSelected && styles.selectedCell
      ]}
    >
      <View style={styles.terrainIcon}>
        <TerrainIcon type={type} size={cellSize} />
      </View>
      {type === CELL_TYPES.BASE_A || type === CELL_TYPES.BASE_B ? (
        <Text style={styles.baseText}>{type === CELL_TYPES.BASE_A ? "A" : "B"}</Text>
      ) : null}
      <View style={styles.pieceLayer}>
        {markers.map((marker, index) => (
          <View
            key={`${marker.piece.id}-${marker.optionIndex ?? "real"}`}
            style={[
              styles.markerWrap,
              markers.length > 1 && {
                transform: [{ translateX: index === 0 ? -7 : 7 }]
              }
            ]}
          >
            <Piece marker={marker} cellSize={cellSize} isSelected={isSelected} />
          </View>
        ))}
      </View>
    </Pressable>
  );
}

const cellStyleByType = StyleSheet.create({
  [CELL_TYPES.NEUTRAL]: {
    backgroundColor: "#cfb98e"
  },
  [CELL_TYPES.BASE_A]: {
    backgroundColor: "#b8c5bd"
  },
  [CELL_TYPES.BASE_B]: {
    backgroundColor: "#c9b2a7"
  },
  [CELL_TYPES.QUANTUM]: {
    backgroundColor: "#b7c7a5"
  },
  [CELL_TYPES.OBSTACLE]: {
    backgroundColor: "#8a8172"
  },
  [CELL_TYPES.ENERGY]: {
    backgroundColor: "#d7c98f"
  }
});

const styles = StyleSheet.create({
  cell: {
    alignItems: "center",
    borderColor: "rgba(70, 52, 33, 0.28)",
    borderWidth: 1,
    justifyContent: "center",
    overflow: "hidden",
    position: "relative"
  },
  highlighted: {
    borderColor: "#f2c14e",
    borderWidth: 3
  },
  selectedCell: {
    borderColor: "#2b2118",
    borderWidth: 3
  },
  terrainIcon: {
    left: 5,
    opacity: 0.72,
    position: "absolute",
    top: 5
  },
  baseText: {
    bottom: 4,
    color: "rgba(44, 34, 25, 0.5)",
    fontSize: 11,
    fontWeight: "900",
    letterSpacing: 0,
    position: "absolute",
    right: 6
  },
  pieceLayer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    minHeight: "100%",
    minWidth: "100%"
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center"
  }
});
