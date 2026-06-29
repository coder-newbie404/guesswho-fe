import { useRef, useEffect } from "react";
import { Button } from "./Button";
import { submitScore } from "../api";

export function GameOverOverlay({ winner, turns, onPlayAgain, gameMode, playerName }) {
  const submitted = useRef(false);

  useEffect(() => {
    if (gameMode === "single" && winner === playerName && !submitted.current) {
      submitted.current = true;
      submitScore(playerName, turns).catch(() => {});
    }
  }, [gameMode, winner, playerName, turns]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" role="dialog" aria-label="Game over">
      <div className="mx-4 w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl dark:bg-gray-800">
        <div className="mb-6 text-center">
          <div className="mb-2 text-4xl">🏆</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Game Over</h2>
          <p className="mt-2 text-3xl font-bold text-indigo-600 dark:text-indigo-400">{winner} wins!</p>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Solved in {turns} turn{turns !== 1 ? "s" : ""}</p>
        </div>
        <Button onClick={onPlayAgain} aria-label="Play again" className="w-full">
          Play Again
        </Button>
      </div>
    </div>
  );
}
