import { socket } from "../services/socket";
import type { Player } from "../types/socket.types";
import Button from "./common/Button";
import PlayerCard from "./lobby/PlayerCard";

interface Props {
  roomCode: string;
  username: string;
  userId: string;
  players: Player[];
  currentTurn?: string;
}

export default function LobbyPanel({
  roomCode,
  username,
  userId,
  players,
  currentTurn,
}: Props) {
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
    <div className="panel lobby-panel">
      <div className="lobby-head">
        <h2 className="panel-title">Lobby</h2>
        <span className="lobby-tag">Live room</span>
      </div>

      <p className="field-label">Room code</p>
      <div className="room-code">{roomCode}</div>

      <div className="btn-group lobby-actions">
        <Button variant="join" onClick={joinRoom}>
          Join Room
        </Button>
        <Button variant="ready" onClick={ready}>
          Ready
        </Button>
        <Button variant="gold" onClick={startGame}>
          Start Game
        </Button>
      </div>

      <hr className="panel-divider" />

      <h3 className="section-label">
        Squad · {players.length}
      </h3>

      {players.length === 0 ? (
        <div className="empty-lobby">
          <div className="empty-lobby-icon" aria-hidden>
            <span>🎮</span>
          </div>
          <p className="empty-lobby-title">Room is empty</p>
          <p className="empty-lobby-text">
            Hit join to enter the arena and invite your rivals.
          </p>
        </div>
      ) : (
        <div className="player-list">
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              isSelf={player.id === userId}
              isTurn={player.id === currentTurn}
            />
          ))}
        </div>
      )}
    </div>
  );
}
