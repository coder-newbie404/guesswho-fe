import { Button } from "./Button";

export function GameOverOverlay({ winner, turns, onPlayAgain }) {
  return (
    <div className="overlay" role="dialog" aria-label="Game over">
      <div className="overlay-card">
        <h2>Game Over</h2>
        <p className="overlay-winner">{winner} wins!</p>
        <p className="overlay-turns">Solved in {turns} turn{turns !== 1 ? "s" : ""}</p>
        <Button onClick={onPlayAgain} aria-label="Play again">Play Again</Button>
      </div>
    </div>
  );
}
