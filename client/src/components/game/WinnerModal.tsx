import type { Player } from "@/lib/game-types";
import { Trophy, RotateCcw, LogOut } from "lucide-react";

interface WinnerModalProps {
  winner: Player;
  isLocalPlayerWinner: boolean;
  onPlayAgain: () => void;
  onLeave: () => void;
}

export function WinnerModal({
  winner,
  isLocalPlayerWinner,
  onPlayAgain,
  onLeave,
}: WinnerModalProps) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="flex flex-col items-center gap-6 p-8 rounded-3xl animate-slide-in-up"
        style={{
          background: "linear-gradient(180deg, #0f1628 0%, #0a0e1a 100%)",
          border: isLocalPlayerWinner
            ? "1px solid rgba(212,175,55,0.5)"
            : "1px solid rgba(255,255,255,0.12)",
          boxShadow: isLocalPlayerWinner
            ? "0 0 60px 16px rgba(212,175,55,0.2), 0 24px 80px rgba(0,0,0,0.8)"
            : "0 24px 80px rgba(0,0,0,0.8)",
          maxWidth: "380px",
          width: "90%",
        }}
      >
        {/* Trophy */}
        <div
          className={`flex items-center justify-center rounded-full ${isLocalPlayerWinner ? "animate-winner-glow" : ""}`}
          style={{
            width: "96px",
            height: "96px",
            background: isLocalPlayerWinner
              ? "linear-gradient(135deg, rgba(212,175,55,0.3) 0%, rgba(212,175,55,0.1) 100%)"
              : "rgba(255,255,255,0.05)",
            border: isLocalPlayerWinner
              ? "2px solid rgba(212,175,55,0.6)"
              : "2px solid rgba(255,255,255,0.1)",
          }}
        >
          <Trophy
            size={44}
            style={{
              color: isLocalPlayerWinner ? "#d4af37" : "rgba(255,255,255,0.5)",
            }}
          />
        </div>

        {/* Title */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div
            className="font-black tracking-widest uppercase"
            style={{
              fontSize: "32px",
              color: isLocalPlayerWinner ? "#d4af37" : "#fff",
              fontFamily: "'Rajdhani', sans-serif",
              letterSpacing: "0.12em",
              lineHeight: 1,
            }}
          >
            {isLocalPlayerWinner ? "You Win!" : "Game Over"}
          </div>
          <div
            className="text-sm font-medium"
            style={{ color: "rgba(255,255,255,0.5)" }}
          >
            {isLocalPlayerWinner
              ? "Congratulations! You outwitted everyone."
              : `${winner.username} wins this round.`}
          </div>
        </div>

        {/* Winner card */}
        <div
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div
            className="flex items-center justify-center rounded-full font-black text-lg shrink-0"
            style={{
              width: "48px",
              height: "48px",
              background: isLocalPlayerWinner
                ? "linear-gradient(135deg, rgba(212,175,55,0.4) 0%, rgba(212,175,55,0.2) 100%)"
                : "rgba(255,255,255,0.08)",
              border: `2px solid ${isLocalPlayerWinner ? "rgba(212,175,55,0.6)" : "rgba(255,255,255,0.12)"}`,
              color: isLocalPlayerWinner ? "#d4af37" : "#fff",
              fontFamily: "'Rajdhani', sans-serif",
            }}
          >
            {winner.avatar}
          </div>
          <div>
            <div
              className="font-black text-base"
              style={{ color: "#fff", fontFamily: "'Rajdhani', sans-serif" }}
            >
              {winner.username}
            </div>
            <div className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              Bluff Master
            </div>
          </div>
          {isLocalPlayerWinner && (
            <div
              className="ml-auto text-xs font-bold px-2 py-1 rounded-full"
              style={{
                background: "rgba(212,175,55,0.15)",
                border: "1px solid rgba(212,175,55,0.4)",
                color: "#d4af37",
              }}
            >
              MVP
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={onPlayAgain}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black transition-all"
            style={{
              background: "linear-gradient(180deg, #22c55e 0%, #16a34a 100%)",
              border: "1px solid #16a34a",
              color: "#fff",
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "15px",
              letterSpacing: "0.08em",
              boxShadow: "0 4px 16px rgba(34,197,94,0.4)",
            }}
          >
            <RotateCcw size={16} />
            Play Again
          </button>
          <button
            onClick={onLeave}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold transition-all"
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#ef4444",
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "14px",
            }}
          >
            <LogOut size={15} />
            Leave
          </button>
        </div>
      </div>
    </div>
  );
}
