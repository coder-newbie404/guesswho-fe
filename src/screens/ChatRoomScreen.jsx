import { useState, useCallback, useEffect, useRef } from "react";
import { useGame } from "../context/GameContext";
import { ask, getRoom, askSingleplayer, getSingleplayerGame } from "../api";
import { usePolling } from "../hooks/usePolling";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { GameOverOverlay } from "../components/GameOverOverlay";
import { ErrorMessage } from "../components/ErrorMessage";

export function ChatRoomScreen() {
  const {
    gameMode, roomId, gameId,
    playerName, question, setQuestion,
    messages, setMessages,
    error, setError, clearError,
    winner, setWinner, resetToHome,
  } = useGame();

  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const chatEndRef = useRef(null);

  const fetchRoom = useCallback(
    () => gameMode === "multi" ? getRoom(roomId) : getSingleplayerGame(gameId),
    [gameMode, roomId, gameId]
  );

  const roomData = usePolling(fetchRoom, 2000);

  useEffect(() => {
    if (roomData?.history) {
      setMessages(roomData.history);
    }
  }, [roomData?.history, setMessages]);

  useEffect(() => {
    if (roomData?.winner && !winner) {
      setWinner(roomData.winner);
    }
  }, [roomData?.winner, winner, setWinner]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const isMyTurn = gameMode === "single" || roomData?.currentPlayer === playerName;

  const handleSendQuestion = async () => {
    if (!question.trim() || loading) return;
    clearError();
    setLoading(true);
    try {
      let data;
      if (gameMode === "single") {
        data = await askSingleplayer(gameId, question);
      } else {
        data = await ask(roomId, playerName, question);
      }
      if (data.room?.history) {
        setMessages(data.room.history);
      }
      setQuestion("");
      if (data.winner) {
        setWinner(data.winner);
      }
    } catch (err) {
      setError(err.message || "Backend connection failed");
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendQuestion();
    }
  };

  const handleLeave = () => {
    if (window.confirm("Leave the game? Progress will be lost.")) {
      resetToHome();
    }
  };

  const turnCount = messages.length;
  const inputDisabled = loading || (!isMyTurn && !winner);

  return (
    <div className="page">
      <button className="back-link" onClick={handleLeave} aria-label="Leave game">
        &larr; Leave
      </button>

      {gameMode === "multi" && (
        <span className="room-badge">{roomId}</span>
      )}

      <div
        className={`turn-bar ${winner ? "waiting" : isMyTurn ? "my-turn" : "waiting"}`}
        role="status"
        aria-live="polite"
      >
        {winner
          ? `Game Over! ${winner} wins!`
          : isMyTurn
            ? "Your turn \u2014 ask a yes/no question or guess"
            : "Waiting for opponent\u2026"}
      </div>

      <div className="chat-area" role="log" aria-live="polite">
        {messages.length === 0 ? (
          <div className="chat-empty">No questions yet</div>
        ) : (
          messages.map((msg, index) => (
            <div key={index} className={`message ${msg.player === playerName ? "mine" : "theirs"}`}>
              <div className="msg-player">{msg.player}</div>
              <div className="msg-question">{msg.question}</div>
              <div className="msg-answer">{msg.answer}</div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="input-row">
        <Input
          ref={inputRef}
          placeholder="Ask yes/no or guess exact name"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={200}
          disabled={inputDisabled}
          required
          aria-label="Ask a question or guess the name"
        />
        <Button
          onClick={handleSendQuestion}
          loading={loading}
          disabled={!question.trim() || inputDisabled}
          aria-label="Send question"
        >
          Send
        </Button>
      </div>

      <ErrorMessage error={error} />

      {winner && (
        <GameOverOverlay
          winner={winner}
          turns={turnCount}
          onPlayAgain={resetToHome}
        />
      )}
    </div>
  );
}
