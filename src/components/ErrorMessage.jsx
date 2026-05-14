export function ErrorMessage({ error }) {
  if (!error) return null;
  return <p className="error" role="alert" aria-live="polite">{error}</p>;
}
