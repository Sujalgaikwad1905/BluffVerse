import type { Player } from "@/lib/game-types";

interface PlayerCardProps {
  player: Player;
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

export function PlayerCard({ player }: PlayerCardProps) {
  const avatarColor = getAvatarColor(player.avatar);

  return (
    <div
      className={`relative flex flex-col items-center gap-2 p-2.5 rounded-xl transition-all duration-300 ${
        player.isEliminated ? "opacity-40" : ""
      }`}
      style={{
        background: player.isCurrentTurn
          ? "rgba(34,197,94,0.08)"
          : "rgba(255,255,255,0.03)",
        border: player.isCurrentTurn
          ? "1px solid rgba(34,197,94,0.4)"
          : "1px solid rgba(255,255,255,0.07)",
        boxShadow: player.isCurrentTurn
          ? "0 0 12px 2px rgba(34,197,94,0.15)"
          : "none",
      }}
    >
      {/* Turn indicator ring */}
      {player.isCurrentTurn && (
        <div
          className="absolute inset-0 rounded-xl animate-turn-pulse pointer-events-none"
          style={{ zIndex: 0 }}
        />
      )}

      {/* Avatar */}
      <div className="relative z-10">
        <div
          className="flex items-center justify-center rounded-full font-black text-sm"
          style={{
            width: "40px",
            height: "40px",
            background: player.isEliminated
              ? "rgba(100,116,139,0.3)"
              : `linear-gradient(135deg, ${avatarColor}cc 0%, ${avatarColor}66 100%)`,
            border: `2px solid ${player.isEliminated ? "rgba(100,116,139,0.4)" : avatarColor + "88"}`,
            color: player.isEliminated ? "#64748b" : "#fff",
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "16px",
          }}
        >
          {player.avatar}
        </div>

        {/* Current turn arrow */}
        {player.isCurrentTurn && (
          <div
            className="absolute -right-1 -bottom-1 rounded-full flex items-center justify-center text-xs"
            style={{
              width: "16px",
              height: "16px",
              background: "#22c55e",
              color: "#0a0e1a",
              fontSize: "8px",
              fontWeight: 900,
            }}
          >
            ▶
          </div>
        )}
      </div>

      {/* Username */}
      <div
        className="relative z-10 text-center font-semibold text-xs truncate w-full"
        style={{
          color: player.isCurrentTurn
            ? "#fff"
            : player.isEliminated
            ? "#475569"
            : "rgba(255,255,255,0.7)",
          fontFamily: "'Rajdhani', sans-serif",
          letterSpacing: "0.04em",
          maxWidth: "72px",
        }}
        title={player.username}
      >
        {player.username}
      </div>

      {/* Card count */}
      <div className="relative z-10 flex items-center gap-1">
        {player.isEliminated ? (
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(239,68,68,0.15)",
              color: "#ef4444",
              border: "1px solid rgba(239,68,68,0.3)",
              fontSize: "10px",
            }}
          >
            OUT
          </span>
        ) : (
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full"
            style={{
              background: player.isCurrentTurn
                ? "rgba(34,197,94,0.15)"
                : "rgba(255,255,255,0.07)",
              border: `1px solid ${player.isCurrentTurn ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.1)"}`,
            }}
          >
            <div
              className="w-1.5 h-2 rounded-sm"
              style={{
                background: player.isCurrentTurn ? "#22c55e" : "rgba(255,255,255,0.5)",
              }}
            />
            <span
              className="text-xs font-bold"
              style={{
                color: player.isCurrentTurn ? "#22c55e" : "rgba(255,255,255,0.6)",
                fontFamily: "'Rajdhani', sans-serif",
              }}
            >
              {player.cardCount}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
