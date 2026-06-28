import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { useWebSocket } from "../hooks/useWebSocket";
import { getWsUrl } from "../api";
import { saveSession, loadSession, clearSession } from "../utils/sessionStorage";

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
  const [hintsRemaining, setHintsRemaining] = useState(3);
  const [mask, setMask] = useState("");
  const [revealedIndices, setRevealedIndices] = useState([]);

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
    const saved = loadSession();
    if (!saved) return;
    const validateAndRestore = async () => {
      try {
        if (saved.gameMode === "single" && saved.gameId) {
          const { getSingleplayerGame } = await import("../api");
          await getSingleplayerGame(saved.gameId);
        } else if (saved.gameMode === "multi" && saved.roomId) {
          const { getRoom } = await import("../api");
          await getRoom(saved.roomId);
        }
        setGameMode(saved.gameMode);
        setRoomId(saved.roomId || "");
        setGameId(saved.gameId || "");
        setPlayerName(saved.playerName);
        setSecret(saved.secret || "");
        setMessages(saved.messages || []);
        setHintsRemaining(saved.hintsRemaining ?? 3);
        setMask(saved.mask || "");
        setRevealedIndices(saved.revealedIndices || []);
        setScreen("chat-room");
      } catch {
        clearSession();
      }
    };
    validateAndRestore();
  }, []);

  useEffect(() => {
    if (!gameMode || !playerName) return;
    if (!roomId && !gameId) return;
    saveSession({
      gameMode,
      roomId,
      gameId,
      playerName,
      secret,
      messages,
      hintsRemaining,
      mask,
      revealedIndices,
    });
  }, [gameMode, roomId, gameId, playerName, secret, messages, hintsRemaining, mask, revealedIndices]);

  /* eslint-disable react-hooks/set-state-in-effect -- reacting to external WebSocket messages */
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
      if (data.hints_remaining !== undefined) {
        setHintsRemaining(data.hints_remaining);
      }
      if (data.mask !== undefined) {
        setMask(data.mask);
      }
    }
  }, [lastMessage, setMessages, setWinner, setScreen]);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (winner) {
      clearSession();
    }
  }, [winner]);

  const clearError = useCallback(() => setError(""), []);

  const resetToHome = useCallback(() => {
    clearSession();
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
    setHintsRemaining(3);
    setMask("");
    setRevealedIndices([]);
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
    hintsRemaining, setHintsRemaining,
    mask, setMask,
    revealedIndices, setRevealedIndices,
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
