import { useState } from "react";
import { useGame } from "../context/GameContext";
import { registerPlayer } from "../api";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { ErrorMessage } from "../components/ErrorMessage";

export function PlayerSetupScreen() {
  const {
    roomId, playerName, setPlayerName,
    secret, setSecret,
    error, setError, clearError,
    setScreen, resetToHome,
  } = useGame();

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const onSuccess = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(roomId).then(onSuccess).catch(() => {
        fallbackCopy(roomId, onSuccess);
      });
    } else {
      fallbackCopy(roomId, onSuccess);
    }
  };

  const fallbackCopy = (text, onSuccess) => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      onSuccess();
    } catch {
      onSuccess();
    }
    document.body.removeChild(ta);
  };

  const handleRegister = async () => {
    if (!playerName.trim() || !secret.trim()) {
      setError("Please fill all fields");
      return;
    }
    clearError();
    setLoading(true);
    try {
      await registerPlayer(roomId, playerName, secret);
      setScreen("waiting-room");
    } catch (err) {
      setError(err.message || "Backend connection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleRegister();
  };

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <button
        onClick={resetToHome}
        className="mb-6 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
        aria-label="Back to home"
      >
        &larr; Back
      </button>

      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
        <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">Player Setup</h2>

        <div
          onClick={handleCopy}
          className="mb-6 w-full cursor-pointer rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 text-center transition-colors hover:border-indigo-400 hover:bg-indigo-50 dark:border-gray-600 dark:bg-gray-700/50 dark:hover:border-indigo-500 dark:hover:bg-indigo-900/20 relative"
        >
          <span
            onClick={handleCopy}
            className="absolute right-2 top-1 cursor-pointer text-xs text-gray-400 hover:text-indigo-500 dark:text-gray-500 dark:hover:text-indigo-400"
            title="Copy room ID"
          >
            📋
          </span>
          <div className="text-sm text-gray-500 dark:text-gray-400">Room ID</div>
          <div className="mt-1 font-mono text-3xl font-bold tracking-widest text-gray-900 dark:text-white select-text">{roomId}</div>
          <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            {copied ? "Copied!" : "Click to copy"}
          </div>
        </div>

        <div className="space-y-3">
          <Input
            placeholder="Your Name"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={20}
            required
            aria-label="Player name"
          />
          <Input
            placeholder="Your Secret Character"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            onKeyDown={handleKeyDown}
            maxLength={50}
            required
            aria-label="Secret character"
          />
          <Button
            onClick={handleRegister}
            loading={loading}
            disabled={!playerName.trim() || !secret.trim()}
            className="w-full"
            aria-label="Join game"
          >
            Join Game
          </Button>
        </div>
      </div>

      <ErrorMessage error={error} />
    </div>
  );
}
