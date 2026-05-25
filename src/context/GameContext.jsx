import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { getWsUrl } from "../api";

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
  const [currentPlayer, setCurrentPlayer] = useState(null);

  const wsUrl = (() => {
    if (screen === "waiting-room" && roomId) {
      return getWsUrl(`/ws/room/${roomId}`);
    }
    if (screen === "chat-room") {
      if (gameMode === "multi" && roomId) {
        return getWsUrl(`/ws/room/${roomId}`);
      }
      if (gameMode === "single" && gameId) {
        return getWsUrl(`/ws/singleplayer/${gameId}`);
      }
    }
    return null;
  })();

  const wsEnabled = wsUrl !== null;
  const { connected: wsConnected, lastMessage } = useWebSocket(wsUrl, wsEnabled);

  useEffect(() => {
    if (!lastMessage) return;
    if (lastMessage.type === "state_update") {
      const data = lastMessage.data;
      if (data.history) {
        setMessages(data.history);
      }
      if (data.winner !== undefined && data.winner !== null) {
        setWinner(data.winner);
      }
      if (data.started !== undefined && data.started) {
        setScreen("chat-room");
      }
      if (data.currentPlayer !== undefined) {
        setCurrentPlayer(data.currentPlayer);
      }
    }
  }, [lastMessage, setMessages, setWinner, setScreen]);

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
    setCurrentPlayer(null);
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
    currentPlayer,
    wsConnected,
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
