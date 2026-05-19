import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { BOARD_SIZE, getCellType, isSamePosition } from "../data/board";
import { getPiecePositions, getPiecesAtCell } from "../utils/gameLogic";
import Cell from "./Cell";

export default function Board({
  pieces,
  selectedPiece,
  highlightedPositions,
  onCellPress,
  alignTop = false
}) {
  const { width, height } = useWindowDimensions();
  const maxFromHeight = Math.max(320, height - 118);
  const boardPixels = Math.min(width - 28, maxFromHeight, 590);
  const cellSize = boardPixels / BOARD_SIZE;
  const selectedPositions = selectedPiece ? getPiecePositions(selectedPiece) : [];

  return (
    <View
      style={[
        styles.board,
        {
          alignSelf: alignTop ? "flex-start" : "center",
          width: boardPixels,
          height: boardPixels
        }
      ]}
    >
      {Array.from({ length: BOARD_SIZE }).map((_, row) => (
        <View key={row} style={styles.row}>
          {Array.from({ length: BOARD_SIZE }).map((__, col) => {
            const position = { row, col };
            const markers = getPiecesAtCell(pieces, position);
            const isHighlighted = highlightedPositions.some((candidate) =>
              isSamePosition(candidate, position)
            );
            const isSelected = selectedPositions.some((candidate) =>
              isSamePosition(candidate, position)
            );

            return (
              <Cell
                key={`${row}-${col}`}
                position={position}
                type={getCellType(position)}
                markers={markers}
                cellSize={cellSize}
                isHighlighted={isHighlighted}
                isSelected={isSelected}
                onPress={() => onCellPress(position)}
              />
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  board: {
    backgroundColor: "#5a432b",
    borderColor: "#4b3521",
    borderRadius: 8,
    borderWidth: 8,
    overflow: "hidden",
    shadowColor: "#2d251d",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 16
  },
  row: {
    flexDirection: "row"
  }
});
