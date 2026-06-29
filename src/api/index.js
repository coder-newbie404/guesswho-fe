const API_URL = import.meta.env.VITE_API_URL;
const REQUEST_TIMEOUT = Number(import.meta.env.VITE_REQUEST_TIMEOUT) || 10000;

async function request(endpoint, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      ...options,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || data.detail || "Request failed");
    return data;
  } catch (err) {
    if (err.name === "AbortError") throw new Error("Request timed out", { cause: err });
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export function createRoom() {
  return request("/create-room", { method: "POST" });
}

export function joinRoom(roomId) {
  return request("/join-room", {
    method: "POST",
    body: JSON.stringify({ roomId }),
  });
}

export function registerPlayer(roomId, playerName, secret) {
  return request("/register-player", {
    method: "POST",
    body: JSON.stringify({ roomId, playerName, secret }),
  });
}

export function ready(roomId, playerName) {
  return request("/ready", {
    method: "POST",
    body: JSON.stringify({ roomId, playerName }),
  });
}

export function ask(roomId, playerName, question) {
  return request("/ask", {
    method: "POST",
    body: JSON.stringify({ roomId, playerName, question }),
  });
}

export function getRoom(roomId) {
  return request(`/room/${roomId}`);
}

export function startSingleplayer(playerName) {
  return request("/singleplayer/start", {
    method: "POST",
    body: JSON.stringify({ playerName }),
  });
}

export function askSingleplayer(gameId, question) {
  return request("/singleplayer/ask", {
    method: "POST",
    body: JSON.stringify({ gameId, question }),
  });
}

export function getSingleplayerGame(gameId) {
  return request(`/singleplayer/${gameId}`);
}

export function surrenderSingleplayer(gameId) {
  return request(`/singleplayer/${gameId}/surrender`, { method: "POST" });
}

export function surrenderMultiplayer(roomId, playerName) {
  return request("/surrender", {
    method: "POST",
    body: JSON.stringify({ roomId, playerName }),
  });
}

export function useHint(gameId) {
  return request(`/singleplayer/${gameId}/hint`, { method: "POST" });
}

export function fetchLeaderboard(top = 10) {
  return request(`/leaderboard?top=${top}`);
}

export function submitScore(name, turns) {
  return request("/leaderboard", {
    method: "POST",
    body: JSON.stringify({ name, turns }),
  });
}

export function getWsUrl(path) {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:8000";
  const wsBase = apiUrl.replace(/^http/, "ws");
  return `${wsBase}${path}`;
}
