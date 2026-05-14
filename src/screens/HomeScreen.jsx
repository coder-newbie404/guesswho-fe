import { useState } from "react";
import { useGame } from "../context/GameContext";
import { createRoom, joinRoom, startSingleplayer } from "../api";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { ErrorMessage } from "../components/ErrorMessage";

export function HomeScreen() {
  const {
    joinRoomId, setJoinRoomId,
    playerName, setPlayerName,
    error, setError, clearError,
    setRoomId, setGameId,
    setScreen, setGameMode,
  } = useGame();

  const [loading, setLoading] = useState(null);

  const handleSingleplayer = async () => {
    if (!playerName.trim()) {
      setError("Enter your name");
      return;
    }
    clearError();
    setLoading("single");
    try {
      const data = await startSingleplayer(playerName);
      setGameId(data.gameId);
      setGameMode("single");
      setScreen("chat-room");
    } catch (err) {
      setError(err.message || "Backend connection failed");
    } finally {
      setLoading(null);
    }
  };

  const handleCreateRoom = async () => {
    clearError();
    setLoading("create");
    try {
      const data = await createRoom();
      setRoomId(data.roomId);
      setGameMode("multi");
      setScreen("player-setup");
    } catch (err) {
      setError(err.message || "Backend connection failed");
    } finally {
      setLoading(null);
    }
  };

  const handleJoinRoom = async () => {
    if (!joinRoomId.trim()) {
      setError("Please enter Room ID");
      return;
    }
    clearError();
    setLoading("join");
    try {
      await joinRoom(joinRoomId.toUpperCase());
      setRoomId(joinRoomId.toUpperCase());
      setGameMode("multi");
      setScreen("player-setup");
    } catch (err) {
      setError(err.message || "Backend connection failed");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="page">
      <p className="tagline">Ask yes/no questions. Guess who they are.</p>

      <section className="section">
        <h2 className="section-title">Solo</h2>
        <Input
          placeholder="Your Name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          maxLength={20}
          required
          aria-label="Player name for single player"
        />
        <Button
          onClick={handleSingleplayer}
          loading={loading === "single"}
          disabled={!playerName.trim()}
          aria-label="Play vs AI"
        >
          Start Game
        </Button>
      </section>

      <hr className="divider" />

      <section className="section">
        <h2 className="section-title">Multiplayer</h2>
        <Button
          onClick={handleCreateRoom}
          loading={loading === "create"}
          disabled={loading !== null}
          aria-label="Create new room"
        >
          Create Room
        </Button>
        <Input
          placeholder="Enter Room ID"
          value={joinRoomId}
          onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
          maxLength={6}
          required
          aria-label="Room ID to join"
        />
        <Button
          onClick={handleJoinRoom}
          loading={loading === "join"}
          disabled={loading !== null || !joinRoomId.trim()}
          aria-label="Join existing room"
        >
          Join Room
        </Button>
      </section>

      <ErrorMessage error={error} />
    </div>
  );
}
