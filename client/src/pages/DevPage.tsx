import ConnectionPanel from "../components/ConnectionPanel";
import LobbyPanel from "../components/LobbyPanel";
import HandPanel from "../components/HandPanel";
import { useSocket } from "../hooks/useSocket";

export default function DevPage() {
  const {
    connected,
    players,
    hand,
  } = useSocket();

  return (
    <div
      style={{
        width: 1000,
        margin: "40px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1>🎮 BluffVerse Developer Panel</h1>

      <ConnectionPanel
        connected={connected}
      />

      <LobbyPanel
        players={players}
      />

      <HandPanel
        hand={hand}
      />
    </div>
  );
}