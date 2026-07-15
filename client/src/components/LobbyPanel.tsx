import { useState } from "react";
import { socket } from "../services/socket";
import type { Player } from "../types/socket.types";

interface Props {
  players: Player[];
}

export default function LobbyPanel({
  players,
}: Props) {
  const [roomCode, setRoomCode] = useState("");
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");

  function joinRoom() {
    socket.emit("join_room", {
      roomCode,
      username,
      userId,
    });
  }

  function ready() {
    socket.emit("player_ready", {
      roomCode,
    });
  }

  function startGame() {
    socket.emit("start_game", {
      roomCode,
    });
  }

  return (
    <div
      style={{
        border: "1px solid gray",
        padding: 20,
        marginBottom: 20,
      }}
    >
      <h2>Lobby</h2>

      <input
        placeholder="Room Code"
        value={roomCode}
        onChange={(e) =>
          setRoomCode(e.target.value)
        }
      />

      <br />
      <br />

      <input
        placeholder="Username"
        value={username}
        onChange={(e) =>
          setUsername(e.target.value)
        }
      />

      <br />
      <br />

      <input
        placeholder="User Id"
        value={userId}
        onChange={(e) =>
          setUserId(e.target.value)
        }
      />

      <br />
      <br />

      <button onClick={joinRoom}>
        Join Room
      </button>

      <button
        onClick={ready}
        style={{ marginLeft: 10 }}
      >
        Ready
      </button>

      <button
        onClick={startGame}
        style={{ marginLeft: 10 }}
      >
        Start Game
      </button>

      <hr />

      <h3>Players</h3>

      {players.length === 0 && (
        <p>No players</p>
      )}

      {players.map((player) => (
        <div key={player.id}>
          {player.username}
          {player.ready ? " ✅" : " ❌"}
        </div>
      ))}
    </div>
  );
}