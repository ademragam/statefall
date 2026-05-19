import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View
} from "react-native";
import * as Lucide from "lucide-react-native";

export default function StartScreen({ onStart }) {
  const PlayIcon = Lucide.Play ?? Lucide.Check;
  const { width, height } = useWindowDimensions();
  const isCompact = width < 640;
  const previewCellSize = Math.max(
    18,
    Math.min(isCompact ? 25 : 28, (width - 116) / 8, (height - 260) / 8)
  );

  return (
    <ScrollView
      contentContainerStyle={[
        styles.screen,
        isCompact && styles.screenCompact
      ]}
    >
      <View style={[styles.table, isCompact && styles.tableCompact]}>
        <View style={styles.header}>
          <Text style={styles.kicker}>Physik-Basiskurs Klasse 12</Text>
          <Text style={[styles.title, isCompact && styles.titleCompact]}>
            Statefall
          </Text>
          <Text style={[styles.subtitle, isCompact && styles.subtitleCompact]}>
            Ein rundenbasiertes Strategie-Spiel mit Holzbrett-Gefuehl:
            drei Figuren pro Team, klare Regeln und Quantenmechaniken, die
            wirklich in Entscheidungen eingreifen.
          </Text>
        </View>

        <View style={styles.previewBoard}>
          {Array.from({ length: 8 }).map((_, row) => (
            <View key={row} style={styles.previewRow}>
              {Array.from({ length: 8 }).map((__, col) => {
                const isBase = row === 0 || row === 7;
                const isStone =
                  (row === 3 && col === 3) ||
                  (row === 4 && col === 4) ||
                  (row === 2 && col === 5);
                const isQuantum =
                  (row === 1 && col === 1) ||
                  (row === 3 && col === 6) ||
                  (row === 6 && col === 6);

                return (
                  <View
                    key={`${row}-${col}`}
                    style={[
                      styles.previewCell,
                      {
                        height: previewCellSize,
                        width: previewCellSize
                      },
                      isBase && styles.previewBase,
                      isStone && styles.previewStone,
                      isQuantum && styles.previewQuantum
                    ]}
                  />
                );
              })}
            </View>
          ))}
        </View>

        <View style={[styles.ruleGrid, isCompact && styles.ruleGridCompact]}>
          <View style={styles.ruleBox}>
            <Text style={styles.ruleTitle}>Ziel</Text>
            <Text style={styles.ruleText}>
              Zerstoere die gegnerische Basis, erreiche 10 Quantenpunkte oder
              besiege alle gegnerischen Figuren.
            </Text>
          </View>
          <View style={styles.ruleBox}>
            <Text style={styles.ruleTitle}>Zug</Text>
            <Text style={styles.ruleText}>
              Figur waehlen, bewegen, eine Aktion ausfuehren, Zug beenden.
            </Text>
          </View>
          <View style={styles.ruleBox}>
            <Text style={styles.ruleTitle}>Physik</Text>
            <Text style={styles.ruleText}>
              Superposition, Messung, Tunneleffekt, Energiequantisierung und
              Verschraenkung werden als einfache Brettspielregeln getestet.
            </Text>
          </View>
        </View>

        <Pressable
          onPress={onStart}
          style={({ pressed }) => [
            styles.startButton,
            isCompact && styles.startButtonCompact,
            pressed && { transform: [{ scale: 0.99 }] }
          ]}
        >
          <PlayIcon color="#fffaf0" size={20} strokeWidth={2.6} />
          <Text style={styles.startText}>Prototyp starten</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: "center",
    backgroundColor: "#e8deca",
    flexGrow: 1,
    justifyContent: "center",
    padding: 20
  },
  screenCompact: {
    justifyContent: "flex-start",
    padding: 10
  },
  table: {
    backgroundColor: "#f5eddd",
    borderColor: "#c6b89e",
    borderRadius: 8,
    borderWidth: 1,
    maxWidth: 920,
    padding: 24,
    shadowColor: "#2d251d",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    width: "100%"
  },
  tableCompact: {
    padding: 14
  },
  header: {
    maxWidth: 720
  },
  kicker: {
    color: "#6f604f",
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 0,
    marginBottom: 8,
    textTransform: "uppercase"
  },
  title: {
    color: "#2f261d",
    fontSize: 44,
    fontWeight: "900",
    letterSpacing: 0,
    lineHeight: 50
  },
  titleCompact: {
    fontSize: 40,
    lineHeight: 45
  },
  subtitle: {
    color: "#5c4e3f",
    fontSize: 16,
    lineHeight: 24,
    marginTop: 10
  },
  subtitleCompact: {
    fontSize: 15,
    lineHeight: 23
  },
  previewBoard: {
    alignSelf: "center",
    backgroundColor: "#5a432b",
    borderRadius: 8,
    borderWidth: 6,
    borderColor: "#5a432b",
    marginVertical: 22,
    overflow: "hidden"
  },
  previewRow: {
    flexDirection: "row"
  },
  previewCell: {
    backgroundColor: "#cfb98e",
    borderColor: "rgba(70, 52, 33, 0.25)",
    borderWidth: 1
  },
  previewBase: {
    backgroundColor: "#bcae9a"
  },
  previewStone: {
    backgroundColor: "#81776b"
  },
  previewQuantum: {
    backgroundColor: "#b6c6a1"
  },
  ruleGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12
  },
  ruleGridCompact: {
    gap: 10
  },
  ruleBox: {
    backgroundColor: "#efe4d1",
    borderRadius: 8,
    flex: 1,
    minWidth: 220,
    padding: 14
  },
  ruleTitle: {
    color: "#2f261d",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0,
    marginBottom: 5
  },
  ruleText: {
    color: "#5c4e3f",
    fontSize: 13,
    lineHeight: 19
  },
  startButton: {
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#5d4632",
    borderRadius: 6,
    flexDirection: "row",
    gap: 8,
    marginTop: 20,
    minHeight: 46,
    paddingHorizontal: 18
  },
  startButtonCompact: {
    alignSelf: "stretch",
    justifyContent: "center"
  },
  startText: {
    color: "#fffaf0",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: 0
  }
});
