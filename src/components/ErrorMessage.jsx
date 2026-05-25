import { useState, useEffect } from "react";

export function ErrorMessage({ error }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setVisible(true);
        setTimeout(() => setVisible(false), 5000);
      }, 0);
      return () => clearTimeout(timer);
    }
    setTimeout(() => setVisible(false), 0);
  }, [error]);

  if (!visible || !error) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700 shadow-lg dark:border-red-800 dark:bg-red-900/50 dark:text-red-300" role="alert" aria-live="polite">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm">{error}</p>
        <button
          onClick={() => setVisible(false)}
          className="shrink-0 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-200"
          aria-label="Dismiss error"
        >
          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}
