export function Button({ children, onClick, disabled, loading, "aria-label": ariaLabel }) {
  return (
    <button
      className="btn"
      onClick={onClick}
      disabled={disabled || loading}
      aria-label={ariaLabel}
    >
      {loading ? `${children}...` : children}
    </button>
  );
}
