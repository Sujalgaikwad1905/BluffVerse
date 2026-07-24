import type { Rank } from "@/lib/game-types";
import { RankSelector } from "./RankSelector";
import { Swords, Play, SkipForward } from "lucide-react";

interface ActionBarProps {
  selectedRank: Rank | null;
  selectedCardCount: number;
  onRankSelect: (rank: Rank) => void;
  onPlay: () => void;
  onCallBluff: () => void;
  onPass: () => void;
  isMyTurn: boolean;
  currentClaim: { rank: Rank; quantity: number; playerUsername: string } | null;
  canCallBluff: boolean;
}

export function ActionBar({
  selectedRank,
  selectedCardCount,
  onRankSelect,
  onPlay,
  onCallBluff,
  onPass,
  isMyTurn,
  canCallBluff,
}: ActionBarProps) {
  const canPlay = isMyTurn && selectedRank !== null && selectedCardCount > 0;

  const handlePlay = () => {
    onPlay();
  };

  const handleCallBluff = () => {
    onCallBluff();
  };

  const handlePass = () => {
    onPass();
  };

  return (
    <div
      className="shrink-0 flex items-center gap-4 px-4"
      style={{
        height: "80px",
        background: "linear-gradient(180deg, #090d1a 0%, #060912 100%)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* Rank Selector */}
      <div className="flex-1 min-w-0">
        <RankSelector
          selectedRank={selectedRank}
          onRankSelect={onRankSelect}
          disabled={!isMyTurn}
        />
      </div>

      {/* Divider */}
      <div
        className="self-stretch"
        style={{
          width: "1px",
          background: "rgba(255,255,255,0.07)",
          margin: "10px 0",
        }}
      />

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        {/* PLAY */}
        <button
          onClick={handlePlay}
          disabled={!canPlay}
          className="flex flex-col items-center justify-center rounded-xl font-black transition-all duration-200 select-none"
          style={{
            width: "72px",
            height: "56px",
            background: canPlay
              ? "linear-gradient(180deg, #22c55e 0%, #16a34a 100%)"
              : "rgba(34,197,94,0.08)",
            border: canPlay
              ? "1px solid #16a34a"
              : "1px solid rgba(34,197,94,0.2)",
            color: canPlay ? "#fff" : "rgba(34,197,94,0.35)",
            boxShadow: canPlay
              ? "0 4px 16px rgba(34,197,94,0.4), inset 0 1px 0 rgba(255,255,255,0.2)"
              : "none",
            cursor: canPlay ? "pointer" : "not-allowed",
            transform: canPlay ? "scale(1)" : "scale(0.97)",
            fontFamily: "'Rajdhani', sans-serif",
          }}
          aria-label="Play selected cards"
        >
          <Play size={16} style={{ marginBottom: "2px" }} />
          <span style={{ fontSize: "12px", letterSpacing: "0.1em" }}>PLAY</span>
        </button>

        {/* CALL BLUFF — the star button */}
        <button
          onClick={handleCallBluff}
          disabled={!canCallBluff}
          className="flex flex-col items-center justify-center rounded-xl font-black transition-all duration-200 select-none relative"
          style={{
            width: "86px",
            height: "60px",
            background: canCallBluff
              ? "linear-gradient(180deg, #ef4444 0%, #b91c1c 100%)"
              : "rgba(239,68,68,0.08)",
            border: canCallBluff
              ? "1px solid #b91c1c"
              : "1px solid rgba(239,68,68,0.2)",
            color: canCallBluff ? "#fff" : "rgba(239,68,68,0.35)",
            boxShadow: canCallBluff
              ? "0 4px 24px rgba(239,68,68,0.55), 0 0 0 2px rgba(239,68,68,0.2), inset 0 1px 0 rgba(255,255,255,0.2)"
              : "none",
            cursor: canCallBluff ? "pointer" : "not-allowed",
            fontFamily: "'Rajdhani', sans-serif",
            transform: canCallBluff ? "scale(1.05)" : "scale(0.97)",
          }}
          aria-label="Call bluff"
        >
          {canCallBluff && (
            <div
              className="absolute -top-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-xs font-black"
              style={{
                background: "#ef4444",
                border: "1px solid rgba(255,255,255,0.25)",
                color: "#fff",
                fontSize: "8px",
                letterSpacing: "0.05em",
                whiteSpace: "nowrap",
              }}
            >
              CALL IT!
            </div>
          )}
          <Swords size={18} style={{ marginBottom: "2px" }} />
          <span style={{ fontSize: "11px", letterSpacing: "0.1em" }}>CALL BLUFF</span>
        </button>

        {/* PASS */}
        <button
          onClick={handlePass}
          disabled={!isMyTurn}
          className="flex flex-col items-center justify-center rounded-xl font-black transition-all duration-200 select-none"
          style={{
            width: "60px",
            height: "48px",
            background: isMyTurn
              ? "rgba(255,255,255,0.07)"
              : "rgba(255,255,255,0.03)",
            border: `1px solid ${isMyTurn ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.06)"}`,
            color: isMyTurn ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.2)",
            cursor: isMyTurn ? "pointer" : "not-allowed",
            fontFamily: "'Rajdhani', sans-serif",
          }}
          aria-label="Pass turn"
        >
          <SkipForward size={14} style={{ marginBottom: "2px" }} />
          <span style={{ fontSize: "11px", letterSpacing: "0.1em" }}>PASS</span>
        </button>
      </div>

      {/* Selection status */}
      <div
        className="shrink-0 flex flex-col items-center justify-center text-center"
        style={{ minWidth: "80px" }}
      >
        {selectedCardCount > 0 && selectedRank ? (
          <div className="animate-slide-in-up">
            <div
              className="font-black"
              style={{
                fontSize: "20px",
                color: "#d4af37",
                fontFamily: "'Rajdhani', sans-serif",
                lineHeight: 1,
              }}
            >
              {selectedCardCount}×{selectedRank}
            </div>
            <div
              className="text-xs"
              style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px" }}
            >
              ready to play
            </div>
          </div>
        ) : isMyTurn ? (
          <div
            className="text-xs text-center"
            style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'Rajdhani', sans-serif" }}
          >
            {selectedCardCount === 0 ? "Select cards" : "Pick a rank"}
          </div>
        ) : (
          <div
            className="text-xs text-center"
            style={{ color: "rgba(255,255,255,0.18)", fontFamily: "'Rajdhani', sans-serif" }}
          >
            Waiting...
          </div>
        )}
      </div>
    </div>
  );
}
