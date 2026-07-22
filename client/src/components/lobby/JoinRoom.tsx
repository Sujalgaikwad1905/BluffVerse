import { useState } from "react";
import { socket } from "@/socket/socket";
import { useGameStore } from "@/store/gameStore";

interface JoinRoomProps {
  onJoin: () => void;
}

export function JoinRoom({ onJoin }: JoinRoomProps) {
  const [username, setUsername] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const setStoreUsername = useGameStore((state) => state.setUsername);
    const setStoreRoomCode = useGameStore((state) => state.setRoomCode);
    const setUserId = useGameStore((state) => state.setUserId);

  return (
    <div
  className="relative min-h-screen flex items-center justify-center p-6"
  style={{ background: "#0a0e1a" }}
>
  <div
    className="pointer-events-none absolute inset-0"
    style={{
      background:
        "radial-gradient(ellipse 60% 40% at 50% 35%, rgba(212,175,55,0.05) 0%, transparent 70%)",
    }}
  />
      <div
        className="w-full rounded-2xl p-8"
        style={{
          maxWidth: "460px",
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 24px 64px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.06) inset",
        }}
      >
        <h1
          className="text-center text-6xl font-black mb-2"
          style={{
            color: "#d4af37",
            fontFamily: "'Rajdhani', sans-serif",
            letterSpacing: "0.08em",
          }}
        >
          BLUFFVERSE
        </h1>

        <p
          className="text-center mb-10"
          style={{
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Real-Time Multiplayer Bluff
        </p>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full rounded-xl px-4 py-3 mb-4 outline-none"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "white",
          }}
        />

        <input
          type="text"
          placeholder="Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
          className="w-full rounded-xl px-4 py-3 mb-5 outline-none"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "white",
          }}
        />

<button
  onClick={() => {
    if (!username.trim()) return;
    if (!roomCode.trim()) return;

    const userId = crypto.randomUUID();

    setStoreUsername(username);
    setStoreRoomCode(roomCode);
    setUserId(userId);

    socket.connect();

    socket.emit("join_room", {
      roomCode,
      userId,
      username,
    });

    onJoin();
  }}
  className="w-full rounded-xl py-3 font-bold transition-all active:scale-[0.98]"
  style={{
    background: "#d4af37",
    color: "#0a0e1a",
  }}
>
  JOIN ROOM
</button>

        <div className="flex items-center my-5">
          <div className="flex-1 h-px bg-white/10" />
          <span className="px-3 text-white/40 text-sm">OR</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <button
          className="w-full rounded-xl py-3 font-bold"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "white",
          }}
        >
          CREATE ROOM
        </button>
      </div>
    </div>
  );
}