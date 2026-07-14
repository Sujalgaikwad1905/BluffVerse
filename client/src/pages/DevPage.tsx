import ConnectionPanel from "../components/ConnectionPanel";
import { useSocket } from "../hooks/useSocket";

export default function DevPage() {
  const { connected } = useSocket();

  return (
    <div
      style={{
        width: 900,
        margin: "40px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1>🎮 BluffVerse Developer Panel</h1>

      <ConnectionPanel
        connected={connected}
      />
    </div>
  );
}