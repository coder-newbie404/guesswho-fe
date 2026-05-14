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
    navigator.clipboard.writeText(roomId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
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
    <div className="page">
      <button className="back-link" onClick={resetToHome} aria-label="Back to home">
        &larr; Back
      </button>

      <section className="section">
        <h2 className="section-title">Player Setup</h2>

        <div className="room-id-box" onClick={handleCopy} role="button" tabIndex={0} aria-label="Copy room ID">
          <div className="room-id-label">Room ID</div>
          <div className="room-id-value">{roomId}</div>
          <div className="room-id-hint">Click to copy</div>
          {copied && <div className="copied-toast">Copied!</div>}
        </div>

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
          aria-label="Join game"
        >
          Join Game
        </Button>
      </section>

      <ErrorMessage error={error} />
    </div>
  );
}
