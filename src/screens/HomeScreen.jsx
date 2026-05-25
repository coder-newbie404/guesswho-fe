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
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Guess Who?</h1>
        <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">Ask yes/no questions. Guess who they are.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800">
          <div className="mb-4 text-3xl">🎯</div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Solo</h2>
          <div className="space-y-3">
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
              className="w-full"
              aria-label="Play vs AI"
            >
              Start Game
            </Button>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg dark:bg-gray-800">
          <div className="mb-4 text-3xl">👥</div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">Multiplayer</h2>
          <div className="space-y-3">
            <Button
              onClick={handleCreateRoom}
              loading={loading === "create"}
              disabled={loading !== null}
              variant="secondary"
              className="w-full"
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
              variant="secondary"
              className="w-full"
              aria-label="Join existing room"
            >
              Join Room
            </Button>
          </div>
        </div>
      </div>

      <ErrorMessage error={error} />
    </div>
  );
}
