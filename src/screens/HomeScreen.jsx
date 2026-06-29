import { useState, useEffect } from "react";
import { useGame } from "../context/GameContext";
import { createRoom, joinRoom, startSingleplayer, fetchLeaderboard } from "../api";
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
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetchLeaderboard(10)
      .then((data) => setLeaderboard(data.entries || []))
      .catch(() => {});
  }, []);

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

      {leaderboard.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white text-center">Leaderboard</h2>
          <div className="rounded-xl bg-white shadow-md dark:bg-gray-800 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">#</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-400">Name</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-400">Turns</th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.map((entry, index) => (
                  <tr key={index} className="border-b border-gray-100 last:border-0 dark:border-gray-700/50">
                    <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">{index + 1}</td>
                    <td className="px-4 py-2 text-sm font-medium text-gray-900 dark:text-white">{entry.name}</td>
                    <td className="px-4 py-2 text-sm text-right text-gray-700 dark:text-gray-300">{entry.turns}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ErrorMessage error={error} />
    </div>
  );
}
