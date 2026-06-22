import { useState } from "react";
import { useGame } from "../context/GameContext";
import { ready } from "../api";
import { Button } from "../components/Button";
import { ErrorMessage } from "../components/ErrorMessage";

export function WaitingRoomScreen() {
  const {
    roomId, playerName, wsConnected,
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

  const handleReady = async () => {
    clearError();
    setLoading(true);
    try {
      const data = await ready(roomId, playerName);
      if (data.started) {
        setScreen("chat-room");
      } else {
        setError("Waiting for other player...");
      }
    } catch (err) {
      setError(err.message || "Backend connection failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLeave = () => {
    if (window.confirm("Leave the room? Progress will be lost.")) {
      resetToHome();
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <button
        onClick={handleLeave}
        className="mb-6 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
        aria-label="Leave room"
      >
        &larr; Leave
      </button>

      <div className="rounded-xl bg-white p-6 shadow-md dark:bg-gray-800">
        <h2 className="mb-6 text-center text-xl font-semibold text-gray-900 dark:text-white">Waiting Room</h2>

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
            {copied ? "Copied!" : "Share this code with your friend"}
          </div>
        </div>

        <div className="mb-4 inline-block rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
          {playerName}
        </div>

        <Button
          onClick={handleReady}
          loading={loading}
          className="w-full"
          aria-label="Ready or start game"
        >
          I&apos;m Ready
        </Button>

        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span className={`inline-block h-2 w-2 rounded-full ${wsConnected ? "bg-green-500" : "bg-red-500"}`} />
          {wsConnected ? "Connected" : "Disconnected"} &middot; Game will start when both players are ready
        </div>
      </div>

      <ErrorMessage error={error} />
    </div>
  );
}
