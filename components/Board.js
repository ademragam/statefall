import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { BOARD_SIZE, getCellType, isSamePosition } from "../data/board";
import { getPiecePositions, getPiecesAtCell } from "../utils/gameLogic";
import Cell from "./Cell";

const BOARD_BORDER_WIDTH = 8;

export default function Board({
  pieces,
  selectedPiece,
  highlightedPositions,
  onCellPress,
  alignTop = false
}) {
  const { width, height } = useWindowDimensions();
  const availableWidth = Math.max(280, width - (width < 640 ? 20 : 28));
  const availableHeight = alignTop
    ? Math.max(320, height - 118)
    : height < 560
      ? Math.max(280, height - 96)
      : 590;
  const boardPixels = Math.min(availableWidth, availableHeight, 590);
  const boardContentPixels = boardPixels - BOARD_BORDER_WIDTH * 2;
  const cellSize = boardContentPixels / BOARD_SIZE;
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
    borderWidth: BOARD_BORDER_WIDTH,
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
