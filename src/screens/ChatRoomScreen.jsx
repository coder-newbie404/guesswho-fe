import { useState, useEffect, useRef } from "react";
import { useGame } from "../context/GameContext";
import { ask, askSingleplayer } from "../api";
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
          ) : (
            messages.map((msg, index) => (
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
            ))
          )}
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
        />
      )}
    </div>
  );
}
