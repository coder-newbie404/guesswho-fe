# Guess Who – Frontend

This repository contains the React frontend for the *Guess Who* game.

## Quick Start

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

The app will be available at `http://localhost:5173` (or another port if 5173 is busy).

## Configuration

- The backend API URL is read from the environment variable `VITE_API_URL`.
- Create a `.env` file in the repository root (already provided) and set:
  ```
  VITE_API_URL=http://127.0.0.1:3001
  ```

## Scripts

| Script   | Description                         |
|----------|-------------------------------------|
| `dev`    | Starts Vite development server      |
| `build`  | Bundles the app for production      |
| `preview`| Serves the production build locally |
| `lint`   | Runs ESLint on the source files     |
| `deploy` | Deploys the build to GitHub Pages   |

## License

MIT – see the root `LICENSE` file (if any) for details.
