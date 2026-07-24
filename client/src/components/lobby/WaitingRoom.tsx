import { useState } from "react";
import { Copy, Users, Play, UserPlus, LogOut, CheckCircle2 } from "lucide-react";
import { Header } from "@/components/game/Header";
import { LobbyPlayerRow } from "./LobbyPlayerRow";
import { useGameStore } from "@/store/gameStore";
import { socket } from "@/socket/socket";




const MAX_PLAYERS = 6;

export function WaitingRoom() {
  const players = useGameStore((state) => state.players);
  const roomCode = useGameStore((state) => state.roomCode);

  const [copied, setCopied] = useState(false);

  const localPlayer = players.find((p) => p.isLocalPlayer)!;
  const isHost = localPlayer?.isHost ?? false;
  const readyCount = players.filter((p) => p.isReady).length;
  const connectedCount = players.filter((p) => p.isConnected).length;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(roomCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleToggleReady = () => {
    socket.emit("player_ready", {
      roomCode,
    });
  };

  const handleLeave = () => {
    window.location.reload();
  };

  const handleStartGame = () => {
    socket.emit("start_game", {
      roomCode,
    });
  };

  return (
    <div className="game-layout">
      
      <Header roomCode={roomCode} onLeave={handleLeave} />

      {/* Main */}
      <main
        className="flex flex-1 min-h-0 items-start justify-center p-3 overflow-y-auto"
        style={{ background: "#0a0e1a" }}
      >
        {/* Subtle radial ambient glow */}
        <div
          className="pointer-events-none fixed inset-0"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 50% 40%, rgba(34,197,94,0.04) 0%, transparent 70%)",
            zIndex: 0,
          }}
        />

        <div
          className="relative z-10 w-full"
          style={{ maxWidth: "520px" }}
        >
          {/* Room Card */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow:
                "0 24px 64px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.06) inset",
            }}
          >
            {/* Card header strip */}
            <div
              className="flex items-center justify-between px-6 py-3"
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              <div>

                <h1
                  className="font-black text-xl tracking-wider"
                  style={{
                    color: "#fff",
                    fontFamily: "'Rajdhani', sans-serif",
                    letterSpacing: "0.06em",
                  }}
                >
                  WAITING ROOM
                </h1>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  Share the room code to invite players
                </p>
              </div>

              {/* Player count badge */}
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-full"
                style={{
                  background: "rgba(212,175,55,0.1)",
                  border: "1px solid rgba(212,175,55,0.25)",
                }}
              >
                <Users size={14} style={{ color: "#d4af37" }} />
                <span
                  className="font-black text-sm"
                  style={{
                    color: "#d4af37",
                    fontFamily: "'Rajdhani', sans-serif",
                    letterSpacing: "0.08em",
                  }}
                >
                  {players.length} / {MAX_PLAYERS}
                </span>
              </div>
            </div>

            {/* Room code row */}
            <div
              className="flex items-center justify-between px-6 py-3"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div>
                <p
                  className="text-xs font-semibold mb-1"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.1em",
                  }}
                >
                  ROOM CODE
                </p>
                <span
                  className="font-black text-2xl tracking-[0.2em]"
                  style={{
                    color: "#d4af37",
                    fontFamily: "'Rajdhani', sans-serif",
                  }}
                >
                  {roomCode}
                </span>
              </div>

              <button
                onClick={handleCopyCode}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-95"
                style={{
                  background: copied
                    ? "rgba(34,197,94,0.15)"
                    : "rgba(212,175,55,0.1)",
                  border: copied
                    ? "1px solid rgba(34,197,94,0.4)"
                    : "1px solid rgba(212,175,55,0.3)",
                  color: copied ? "#22c55e" : "#d4af37",
                  fontFamily: "'Rajdhani', sans-serif",
                  letterSpacing: "0.04em",
                }}
              >
                {copied ? (
                  <>
                    <CheckCircle2 size={15} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={15} />
                    Copy Code
                  </>
                )}
              </button>
            </div>

            {/* Player list */}
            <div             className="px-6 py-3">
              <div className="flex items-center justify-between mb-2">
                <p
                  className="text-xs font-semibold"
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.1em",
                  }}
                >
                  PLAYERS JOINED
                </p>
                <span
                  className="text-xs font-semibold"
                  style={{ color: "rgba(255,255,255,0.3)" }}
                >
                  {readyCount} of {players.length} ready
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                {players.map((player) => (
                  <LobbyPlayerRow key={player.id} player={player} />
                ))}

                {/* Empty slots — show max 2 to keep the card compact */}
                {Array.from({ length: Math.min(2, MAX_PLAYERS - players.length) }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{
                      border: "1px dashed rgba(255,255,255,0.08)",
                      background: "transparent",
                    }}
                  >
                    <div
                      className="flex items-center justify-center rounded-full shrink-0"
                      style={{
                        width: "40px",
                        height: "40px",
                        background: "rgba(255,255,255,0.04)",
                        border: "2px dashed rgba(255,255,255,0.1)",
                      }}
                    >
                      <Users size={14} style={{ color: "rgba(255,255,255,0.2)" }} />
                    </div>
                    <span
                      className="text-sm"
                      style={{ color: "rgba(255,255,255,0.2)" }}
                    >
                      Waiting for player...
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons */}
            <div
              className="px-6 py-3 flex flex-col gap-2"
              style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
            >
              {/* Local player: Ready toggle */}
              <button
                onClick={handleToggleReady}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-base tracking-wider transition-all active:scale-[0.98]"
                style={{
                  background: localPlayer?.isReady
                    ? "rgba(34,197,94,0.15)"
                    : "linear-gradient(135deg, rgba(34,197,94,0.9) 0%, rgba(21,128,61,0.9) 100%)",
                  border: localPlayer?.isReady
                    ? "1px solid rgba(34,197,94,0.5)"
                    : "1px solid rgba(34,197,94,0.6)",
                  color: localPlayer?.isReady ? "#22c55e" : "#fff",
                  fontFamily: "'Rajdhani', sans-serif",
                  letterSpacing: "0.1em",
                  boxShadow: localPlayer?.isReady
                    ? "none"
                    : "0 4px 20px rgba(34,197,94,0.3)",
                }}
              >
                <CheckCircle2 size={18} />
                {localPlayer?.isReady ? "Cancel Ready" : "Ready Up"}
              </button>

              {/* Host controls */}
              {isHost && (
                <div className="flex gap-3">
                  <button
                    onClick={handleStartGame}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm tracking-wider transition-all active:scale-[0.98]"
                    style={{
                      background: "linear-gradient(135deg, #d4af37 0%, #b8962e 100%)",
                      border: "1px solid rgba(212,175,55,0.4)",
                      color: "#0a0e1a",
                      fontFamily: "'Rajdhani', sans-serif",
                      letterSpacing: "0.08em",
                      boxShadow: "0 4px 20px rgba(212,175,55,0.25)",
                    }}
                  >
                    <Play size={15} fill="currentColor" />
                    Start Game
                  </button>

                  <button
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm tracking-wider transition-all active:scale-[0.98]"
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.7)",
                      fontFamily: "'Rajdhani', sans-serif",
                      letterSpacing: "0.08em",
                    }}
                  >
                    <UserPlus size={15} />
                    Invite Players
                  </button>
                </div>
              )}

              {/* Leave */}
              <button
                onClick={handleLeave}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all active:scale-[0.98]"
                style={{
                  background: "rgba(239,68,68,0.08)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  color: "rgba(239,68,68,0.8)",
                  fontFamily: "'Rajdhani', sans-serif",
                  letterSpacing: "0.06em",
                }}
              >
                <LogOut size={14} />
                Leave Room
              </button>
            </div>
          </div>

          {/* Bottom status bar */}
          <div className="flex items-center justify-between mt-4 px-1">
            <div className="flex items-center gap-2">
              {/* Pulsing dot */}
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: "#22c55e" }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ background: "#22c55e" }}
                />
              </span>
              <span
                className="text-sm font-semibold"
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontFamily: "'Rajdhani', sans-serif",
                  letterSpacing: "0.06em",
                }}
              >
                Waiting for players...
              </span>
            </div>

            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Users size={12} style={{ color: "rgba(255,255,255,0.4)" }} />
              <span
                className="text-xs font-bold"
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "'Rajdhani', sans-serif",
                  letterSpacing: "0.08em",
                }}
              >
                {connectedCount} / {MAX_PLAYERS} Players Joined
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
