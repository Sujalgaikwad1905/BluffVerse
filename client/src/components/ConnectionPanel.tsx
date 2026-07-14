import { socket } from "../services/socket";

interface Props {
  connected: boolean;
}

export default function ConnectionPanel({
  connected,
}: Props) {
  function connect() {
    socket.connect();
  }

  function disconnect() {
    socket.disconnect();
  }

  return (
    <div
      style={{
        border: "1px solid gray",
        padding: 20,
        marginBottom: 20,
      }}
    >
      <h2>Connection</h2>

      <p>
        Status :{" "}
        {connected ? "🟢 Connected" : "🔴 Disconnected"}
      </p>

      {!connected ? (
        <button onClick={connect}>
          Connect
        </button>
      ) : (
        <button onClick={disconnect}>
          Disconnect
        </button>
      )}
    </div>
  );
}