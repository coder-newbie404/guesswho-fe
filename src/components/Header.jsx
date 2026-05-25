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
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 shadow-md">
      <div className="mx-auto flex max-w-4xl items-center justify-between">
        <button
          onClick={goHome}
          className="text-xl font-bold text-white transition-opacity hover:opacity-90 cursor-pointer"
          aria-label="Go to home"
        >
          GuessWho
        </button>
        <button
          onClick={toggleTheme}
          className="rounded-full p-2 text-white/80 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
            </svg>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
