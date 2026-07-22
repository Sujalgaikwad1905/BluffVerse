import type { LobbyPlayer } from "@/lib/game-types";

interface LobbyPlayerRowProps {
  player: LobbyPlayer;
}

const AVATAR_COLORS: Record<string, string> = {
  Y: "#d4af37",
  S: "#8b5cf6",
  B: "#3b82f6",
  N: "#ef4444",
  A: "#06b6d4",
  R: "#f97316",
  G: "#22c55e",
  M: "#ec4899",
};

function getAvatarColor(initial: string): string {
  return AVATAR_COLORS[initial] ?? "#64748b";
}

export function LobbyPlayerRow({ player }: LobbyPlayerRowProps) {
  const avatarColor = getAvatarColor(player.avatar);

  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200"
      style={{
        background: player.isLocalPlayer
          ? "rgba(212,175,55,0.06)"
          : "rgba(255,255,255,0.03)",
        border: player.isLocalPlayer
          ? "1px solid rgba(212,175,55,0.2)"
          : "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Avatar */}
      <div
        className="flex items-center justify-center rounded-full font-black shrink-0"
        style={{
          width: "40px",
          height: "40px",
          background: `linear-gradient(135deg, ${avatarColor}cc 0%, ${avatarColor}55 100%)`,
          border: `2px solid ${avatarColor}88`,
          color: "#fff",
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: "16px",
        }}
      >
        {player.avatar}
      </div>

      {/* Name + badges */}
      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className="font-bold text-sm truncate"
            style={{
              color: player.isLocalPlayer ? "#d4af37" : "rgba(255,255,255,0.9)",
              fontFamily: "'Rajdhani', sans-serif",
              letterSpacing: "0.04em",
            }}
          >
            {player.username}
          </span>
          {player.isLocalPlayer && (
            <span
              className="text-xs px-1.5 py-0.5 rounded font-semibold shrink-0"
              style={{
                background: "rgba(212,175,55,0.15)",
                border: "1px solid rgba(212,175,55,0.3)",
                color: "#d4af37",
                fontSize: "10px",
              }}
            >
              YOU
            </span>
          )}
          {player.isHost && (
            <span
              className="text-xs px-1.5 py-0.5 rounded font-semibold shrink-0"
              style={{
                background: "rgba(212,175,55,0.12)",
                border: "1px solid rgba(212,175,55,0.25)",
                color: "#f0d060",
                fontSize: "10px",
              }}
            >
              HOST
            </span>
          )}
        </div>

        {/* Connection status text */}
        <span
          className="text-xs"
          style={{
            color: player.isConnected ? "rgba(34,197,94,0.7)" : "rgba(239,68,68,0.7)",
          }}
        >
          {player.isConnected ? "Connected" : "Reconnecting..."}
        </span>
      </div>

      {/* Right side: connection dot + ready badge */}
      <div className="flex items-center gap-2.5 shrink-0">
        {/* Connection indicator */}
        <div
          className="rounded-full shrink-0"
          style={{
            width: "8px",
            height: "8px",
            background: player.isConnected ? "#22c55e" : "#ef4444",
            boxShadow: player.isConnected
              ? "0 0 6px 2px rgba(34,197,94,0.5)"
              : "0 0 6px 2px rgba(239,68,68,0.5)",
          }}
        />

        {/* Ready badge */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-semibold text-xs"
          style={{
            background: player.isReady
              ? "rgba(34,197,94,0.12)"
              : "rgba(255,255,255,0.05)",
            border: player.isReady
              ? "1px solid rgba(34,197,94,0.35)"
              : "1px solid rgba(255,255,255,0.1)",
            color: player.isReady ? "#22c55e" : "rgba(255,255,255,0.4)",
            minWidth: "72px",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              display: "inline-block",
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              background: player.isReady ? "#22c55e" : "rgba(255,255,255,0.2)",
            }}
          />
          {player.isReady ? "Ready" : "Not ready"}
        </div>
      </div>
    </div>
  );
}
