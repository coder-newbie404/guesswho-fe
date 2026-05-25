import { useState } from "react";
import { useGame } from "../context/GameContext";
import { ready } from "../api";
import { Button } from "../components/Button";
import { ErrorMessage } from "../components/ErrorMessage";

export function WaitingRoomScreen() {
  const {
    roomId, playerName, wsConnected,
    error, setError, clearError,
    setScreen, setMessages, resetToHome,
  } = useGame();

  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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
    <div className="page">
      <button className="back-link" onClick={handleLeave} aria-label="Leave room">
        &larr; Leave
      </button>

      <section className="section">
        <h2 className="section-title">Waiting Room</h2>

        <div className="room-id-box" onClick={handleCopy} role="button" tabIndex={0} aria-label="Copy room ID">
          <div className="room-id-label">Room ID</div>
          <div className="room-id-value">{roomId}</div>
          <div className="room-id-hint">Share this code with your friend</div>
          {copied && <div className="copied-toast">Copied!</div>}
        </div>

        <div className="player-badge">{playerName}</div>

        <Button
          onClick={handleReady}
          loading={loading}
          aria-label="Ready or start game"
        >
          I'm Ready
        </Button>

        <span className={`ws-status ${wsConnected ? "connected" : "disconnected"}`} />

        <div className="waiting-status">Game will start when both players are ready</div>
      </section>

      <ErrorMessage error={error} />
    </div>
  );
}
