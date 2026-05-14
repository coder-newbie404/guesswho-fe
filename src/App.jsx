import { GameProvider, useGame } from "./context/GameContext";
import { Header } from "./components/Header";
import { HomeScreen } from "./screens/HomeScreen";
import { PlayerSetupScreen } from "./screens/PlayerSetupScreen";
import { WaitingRoomScreen } from "./screens/WaitingRoomScreen";
import { ChatRoomScreen } from "./screens/ChatRoomScreen";

function ScreenRouter() {
  const { screen } = useGame();

  switch (screen) {
    case "chat-room":
      return <ChatRoomScreen />;
    case "waiting-room":
      return <WaitingRoomScreen />;
    case "player-setup":
      return <PlayerSetupScreen />;
    default:
      return <HomeScreen />;
  }
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
