import { useState, useEffect, useRef } from "react";
import { useGame } from "../context/GameContext";
import { ask, askSingleplayer, surrenderSingleplayer, surrenderMultiplayer, useHint as fetchHint } from "../api";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { GameOverOverlay } from "../components/GameOverOverlay";
import { ErrorMessage } from "../components/ErrorMessage";

export function ChatRoomScreen() {
  const {
    gameMode, roomId, gameId,
    playerName, question, setQuestion,
    messages,
    error, setError, clearError,
    winner, setWinner, wsConnected,
    currentPlayer, resetToHome,
    hintsRemaining, setHintsRemaining,
    mask, setMask,
  } = useGame();

  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const isMyTurn = gameMode === "single" || currentPlayer === playerName;

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

  const handleSurrender = async () => {
    if (!window.confirm("Are you sure you want to surrender?")) return;
    try {
      let data;
      if (gameMode === "single") {
        data = await surrenderSingleplayer(gameId);
      } else {
        data = await surrenderMultiplayer(roomId, playerName);
      }
      if (data.winner) {
        setWinner(data.winner);
      }
    } catch (err) {
      setError(err.message || "Failed to surrender");
    }
  };

  const handleHint = async () => {
    try {
      const data = await fetchHint(gameId);
      setHintsRemaining(data.hints_remaining);
      setMask(data.mask);
    } catch (err) {
      setError(err.message || "Failed to get hint");
    }
  };

  const turnCount = messages.length;
  const inputDisabled = loading || (!isMyTurn && !winner);

  return (
    <div className="flex h-[calc(100vh-56px)] flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-2 dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          {gameMode === "multi" && (
            <span className="rounded-md bg-gray-100 px-2 py-1 font-mono text-sm font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">{roomId}</span>
          )}
          <div
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              winner
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                : isMyTurn
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
            }`}
            role="status"
            aria-live="polite"
          >
            {winner
              ? `Game Over! ${winner} wins!`
              : isMyTurn
                ? "Your turn — ask a yes/no question or guess"
                : "Waiting for opponent..."}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleSurrender}
            disabled={!!winner || (gameMode === "multi" && !isMyTurn)}
            className="rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 cursor-pointer"
            aria-label="Surrender"
          >
            Surrender
          </button>
          {gameMode === "single" && !winner && (
            <button
              onClick={handleHint}
              disabled={hintsRemaining <= 0}
              className="rounded-md bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700 hover:bg-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-yellow-900/30 dark:text-yellow-300 dark:hover:bg-yellow-900/50 cursor-pointer"
              aria-label="Use hint"
            >
              Hint ({hintsRemaining})
            </button>
          )}
          <span className={`inline-block h-2 w-2 rounded-full ${wsConnected ? "bg-green-500" : "bg-red-500"}`} />
          <button
            onClick={handleLeave}
            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer"
            aria-label="Leave game"
          >
            Leave
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4 dark:bg-gray-900">
        <div className="mx-auto max-w-2xl space-y-3">
          {messages.length === 0 ? (
            <div className="py-12 text-center text-gray-400 dark:text-gray-600">No questions yet</div>
          ) : null}
          {gameMode === "single" && mask && !winner && (
            <div className="rounded-xl bg-yellow-50 px-4 py-3 text-center font-mono text-lg tracking-widest dark:bg-yellow-900/20">
              {mask.split("").map((char, i) => (
                <span key={i} className={char !== "_" ? "text-yellow-700 dark:text-yellow-300 font-bold" : "text-gray-300 dark:text-gray-600"}>
                  {char}{" "}
                </span>
              ))}
            </div>
          )}
          {messages.length > 0 && messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.player === playerName ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[75%] ${msg.player === playerName ? "order-2" : "order-1"}`}>
                  <div className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                    {msg.player === playerName ? "You" : msg.player}
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      msg.player === playerName
                        ? "rounded-br-sm bg-indigo-600 text-white dark:bg-indigo-500"
                        : "rounded-bl-sm bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                    }`}
                  >
                    <div className="font-medium">{msg.question}</div>
                    <div className={`mt-1 text-sm ${msg.player === playerName ? "text-indigo-200" : "text-gray-500 dark:text-gray-400"}`}>
                      {msg.answer}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-800">
        <div className="mx-auto flex max-w-2xl gap-2">
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
      </div>

      <ErrorMessage error={error} />

      {winner && (
        <GameOverOverlay
          winner={winner}
          turns={turnCount}
          onPlayAgain={resetToHome}
          gameMode={gameMode}
          playerName={playerName}
        />
      )}
    </div>
  );
}
