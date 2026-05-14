import { createContext, useContext, useState, useCallback } from "react";

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [screen, setScreen] = useState("home");
  const [gameMode, setGameMode] = useState(null);
  const [roomId, setRoomId] = useState("");
  const [gameId, setGameId] = useState("");
  const [joinRoomId, setJoinRoomId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [secret, setSecret] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [winner, setWinner] = useState(null);

  const clearError = useCallback(() => setError(""), []);

  const resetToHome = useCallback(() => {
    setScreen("home");
    setGameMode(null);
    setRoomId("");
    setGameId("");
    setJoinRoomId("");
    setPlayerName("");
    setSecret("");
    setQuestion("");
    setMessages([]);
    setError("");
    setWinner(null);
  }, []);

  const value = {
    screen, setScreen,
    gameMode, setGameMode,
    roomId, setRoomId,
    gameId, setGameId,
    joinRoomId, setJoinRoomId,
    playerName, setPlayerName,
    secret, setSecret,
    question, setQuestion,
    messages, setMessages,
    error, setError, clearError,
    winner, setWinner,
    resetToHome,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used within GameProvider");
  return ctx;
}
