import { useTheme } from "../hooks/useTheme";
import { useGame } from "../context/GameContext";

export function Header() {
  const { theme, toggleTheme } = useTheme();
  const { resetToHome } = useGame();

  const goHome = () => {
    if (window.location.pathname !== "/") {
      resetToHome();
    }
  };

  return (
    <header className="header">
      <button className="header-title" onClick={goHome} aria-label="Go to home">
        GuessWho
      </button>
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? "\u263E" : "\u2600"}
      </button>
    </header>
  );
}
