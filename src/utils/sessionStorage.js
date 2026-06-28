const STORAGE_KEY = "guesswho_session";
const TTL_MS = 30 * 60 * 1000;

export function saveSession(data) {
  const session = { ...data, lastActivity: Date.now() };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // localStorage unavailable
  }
}

export function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (Date.now() - session.lastActivity > TTL_MS) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage unavailable
  }
}
