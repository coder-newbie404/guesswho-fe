# GuessWho — Frontend

React + Vite frontend for the GuessWho game. Supports multiplayer rooms and single-player vs AI.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

The app runs at `http://localhost:5173` by default.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |
| `npm run deploy` | Deploy to GitHub Pages |

## Environment Variables

| Variable | Default | Description |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | Backend API base URL |
| `VITE_REQUEST_TIMEOUT` | `10000` | Fetch timeout in milliseconds |
| `VITE_BASE_PATH` | `/guesswho/` | Base path for deployment (must match repo name for GitHub Pages) |

## Game Modes

- **Single Player**: Play solo against the AI. The AI picks a secret character, and you ask yes/no questions to narrow it down.
- **Multiplayer**: Create or join a room with a 6-character code. Both players pick a secret character and take turns asking questions.

## Project Structure

```
src/
  main.jsx          # Entry point
  App.jsx            # Screen router
  App.css            # Component styles
  index.css          # Global/reset styles
  api/
    index.js         # Fetch wrapper + all API calls
  components/
    ErrorMessage.jsx
  context/
    GameContext.jsx   # Global game state
  hooks/
    usePolling.js     # Interval-based data fetching
  screens/
    HomeScreen.jsx
    PlayerSetupScreen.jsx
    WaitingRoomScreen.jsx
    ChatRoomScreen.jsx
```
