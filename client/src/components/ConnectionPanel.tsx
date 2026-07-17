import { socket } from "../services/socket";
import Button from "./common/Button";

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
    <div className="connection-badge-wrapper">
      <div
        className={`connection-badge ${connected ? "connected" : "disconnected"}`}
      >
        <span
          className={`connection-dot ${connected ? "connected" : "disconnected"}`}
        />
        {connected ? "Connected" : "Disconnected"}
        {!connected ? (
          <Button variant="secondary" size="sm" onClick={connect}>
            Connect
          </Button>
        ) : (
          <Button variant="secondary" size="sm" onClick={disconnect}>
            Disconnect
          </Button>
        )}
      </div>
    </div>
  );
}
