import { GameProvider, useGame } from "./context/GameContext";
import { Header } from "./components/Header";
import { HomeScreen } from "./screens/HomeScreen";
import { PlayerSetupScreen } from "./screens/PlayerSetupScreen";
import { WaitingRoomScreen } from "./screens/WaitingRoomScreen";
import { ChatRoomScreen } from "./screens/ChatRoomScreen";

function ScreenRouter() {
  const { screen } = useGame();

  let content;
  switch (screen) {
    case "chat-room":
      content = <ChatRoomScreen />;
      break;
    case "waiting-room":
      content = <WaitingRoomScreen />;
      break;
    case "player-setup":
      content = <PlayerSetupScreen />;
      break;
    default:
      content = <HomeScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      {content}
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <Header />
      <ScreenRouter />
    </GameProvider>
  );
}

export default App;
