import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import * as Lucide from "lucide-react-native";

import { ABILITIES } from "../data/quantumAbilities";

function Icon({ name, color }) {
  const IconComponent = Lucide[name] ?? Lucide.Circle;
  return <IconComponent color={color} size={18} strokeWidth={2.25} />;
}

function ActionButton({ action, active, disabled, onPress }) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.actionButton,
        active && styles.activeButton,
        disabled && styles.disabledButton,
        pressed && !disabled && styles.pressedButton
      ]}
    >
      <Icon
        name={action.icon}
        color={disabled ? "#948879" : active ? "#fffaf0" : "#31271e"}
      />
      <Text
        style={[
          styles.actionLabel,
          active && styles.activeLabel,
          disabled && styles.disabledLabel
        ]}
      >
        {action.label}
      </Text>
      {action.cost ? <Text style={styles.costText}>{action.cost} QE</Text> : null}
    </Pressable>
  );
}

export default function ActionMenu({
  selectedPiece,
  selectedAction,
  movedThisTurn,
  actedThisTurn,
  onActionPress,
  onEndTurn,
  gameOver
}) {
  const noPiece = !selectedPiece || selectedPiece.hp <= 0;
  const actionLocked = gameOver || noPiece || actedThisTurn;
  const moveLocked = gameOver || noPiece || movedThisTurn || actedThisTurn;

  const actionList = [
    {
      key: "move",
      label: "Bewegen",
      icon: "Move",
      disabled: moveLocked
    },
    {
      key: "attack",
      label: "Angreifen",
      icon: "Swords",
      disabled: actionLocked
    },
    {
      key: "superposition",
      label: "Superposition",
      icon: "Shuffle",
      cost: 1,
      disabled:
        actionLocked ||
        selectedPiece?.templateKey !== "photon" ||
        selectedPiece.quantumEnergy < 1
    },
    {
      key: "measure",
      label: "Messung",
      icon: "Eye",
      disabled: actionLocked
    },
    {
      key: "tunnel",
      label: "Tunneln",
      icon: "CornerUpRight",
      cost: 2,
      disabled:
        actionLocked ||
        selectedPiece?.templateKey !== "electron" ||
        selectedPiece.quantumEnergy < 2
    },
    {
      key: "entangle",
      label: "Verschraenken",
      icon: "Link2",
      cost: 2,
      disabled:
        actionLocked ||
        selectedPiece?.templateKey !== "quark" ||
        selectedPiece.quantumEnergy < 2
    },
    {
      key: "energy",
      label: "Energie",
      icon: "Zap",
      disabled: actionLocked
    },
    {
      key: "defend",
      label: "Basis",
      icon: "Shield",
      disabled: actionLocked
    }
  ];

  const activeCopy =
    selectedAction && ABILITIES[selectedAction]
      ? ABILITIES[selectedAction]
      : noPiece
        ? {
            label: "Keine Figur",
            short: "Waehle eine Figur des aktuellen Teams auf dem Brett.",
            physics:
              "Das Spiel bleibt rundenbasiert: erst Figur, dann Bewegung und Aktion."
          }
        : {
            label: selectedPiece.role,
            short: selectedPiece.rulesText,
            physics:
              "QE steht fuer Quantenenergie. Alle Kosten werden in ganzen Einheiten bezahlt."
          };

  return (
    <View style={styles.panel}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>Aktionsmenue</Text>
          <Text style={styles.title}>
            {selectedPiece ? selectedPiece.role : "Figur waehlen"}
          </Text>
        </View>
        <Pressable
          onPress={onEndTurn}
          disabled={gameOver}
          style={({ pressed }) => [
            styles.endTurnButton,
            pressed && !gameOver && styles.pressedButton,
            gameOver && styles.disabledButton
          ]}
        >
          <Icon name="Check" color={gameOver ? "#948879" : "#fffaf0"} />
          <Text style={styles.endTurnText}>Zug beenden</Text>
        </Pressable>
      </View>

      <View style={styles.actionGrid}>
        {actionList.map((action) => (
          <ActionButton
            key={action.key}
            action={action}
            active={selectedAction === action.key}
            disabled={action.disabled}
            onPress={() => onActionPress(action.key)}
          />
        ))}
      </View>

      <View style={styles.explainBox}>
        <Text style={styles.explainTitle}>{activeCopy.label}</Text>
        <Text style={styles.explainText}>{activeCopy.short}</Text>
        <Text style={styles.physicsText}>{activeCopy.physics}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    backgroundColor: "#f3ead8",
    borderColor: "#c7b99f",
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 14,
    shadowColor: "#2d251d",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8
  },
  headerRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between"
  },
  eyebrow: {
    color: "#7a6a56",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0,
    textTransform: "uppercase"
  },
  title: {
    color: "#2f261d",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 0
  },
  endTurnButton: {
    alignItems: "center",
    backgroundColor: "#5d4632",
    borderRadius: 6,
    flexDirection: "row",
    gap: 7,
    minHeight: 40,
    paddingHorizontal: 12
  },
  endTurnText: {
    color: "#fffaf0",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0
  },
  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  actionButton: {
    alignItems: "center",
    backgroundColor: "#fff8eb",
    borderColor: "#c9bda6",
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: "row",
    gap: 6,
    minHeight: 40,
    paddingHorizontal: 10
  },
  activeButton: {
    backgroundColor: "#5d4632",
    borderColor: "#5d4632"
  },
  disabledButton: {
    backgroundColor: "#e7dccb",
    opacity: 0.72
  },
  pressedButton: {
    transform: [{ scale: 0.98 }]
  },
  actionLabel: {
    color: "#31271e",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 0
  },
  activeLabel: {
    color: "#fffaf0"
  },
  disabledLabel: {
    color: "#948879"
  },
  costText: {
    color: "#7a6a56",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0
  },
  explainBox: {
    backgroundColor: "#ebe0cb",
    borderRadius: 6,
    padding: 12
  },
  explainTitle: {
    color: "#2f261d",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0,
    marginBottom: 4
  },
  explainText: {
    color: "#4f4235",
    fontSize: 13,
    lineHeight: 19
  },
  physicsText: {
    color: "#3f554d",
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 19,
    marginTop: 7
  }
});
