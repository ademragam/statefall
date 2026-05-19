import React, { useState } from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";

import StartScreen from "./screens/StartScreen";
import GameScreen from "./screens/GameScreen";

export default function App() {
  const [screen, setScreen] = useState("start");
  const [gameKey, setGameKey] = useState(1);

  const startGame = () => {
    setGameKey((value) => value + 1);
    setScreen("game");
  };

  return (
    <SafeAreaView style={styles.appShell}>
      <StatusBar barStyle="dark-content" />
      {screen === "start" ? (
        <StartScreen onStart={startGame} />
      ) : (
        <GameScreen
          key={gameKey}
          onRestart={startGame}
          onBackToStart={() => setScreen("start")}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  appShell: {
    flex: 1,
    backgroundColor: "#e8deca"
  }
});
