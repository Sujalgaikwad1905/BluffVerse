import type { Rank } from "@/lib/game-types";
import { RANKS } from "@/lib/game-types";

interface RankSelectorProps {
  selectedRank: Rank | null;
  onRankSelect: (rank: Rank) => void;
  disabled?: boolean;
}

// Color-code special ranks for quick visual recognition
const RANK_COLORS: Partial<Record<Rank, { bg: string; border: string; text: string }>> = {
  A: { bg: "rgba(212,175,55,0.15)", border: "rgba(212,175,55,0.5)", text: "#d4af37" },
  K: { bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.4)", text: "#60a5fa" },
  Q: { bg: "rgba(168,85,247,0.12)", border: "rgba(168,85,247,0.4)", text: "#c084fc" },
  J: { bg: "rgba(234,179,8,0.12)", border: "rgba(234,179,8,0.35)", text: "#fbbf24" },
};

function getDefaultStyle(selected: boolean): {
  bg: string;
  border: string;
  text: string;
} {
  return {
    bg: selected ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)",
    border: selected ? "rgba(34,197,94,0.5)" : "rgba(255,255,255,0.1)",
    text: selected ? "#22c55e" : "rgba(255,255,255,0.55)",
  };
}

export function RankSelector({
  selectedRank,
  onRankSelect,
  disabled = false,
}: RankSelectorProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className="text-xs font-bold tracking-widest uppercase"
        style={{
          color: "rgba(255,255,255,0.35)",
          fontFamily: "'Rajdhani', sans-serif",
          fontSize: "10px",
          letterSpacing: "0.15em",
        }}
      >
        Claim Rank
      </div>

      <div className="flex items-center gap-1 flex-wrap">
        {RANKS.map((rank) => {
          const isSelected = selectedRank === rank;
          const customColors = RANK_COLORS[rank];
          const style = isSelected
            ? customColors
              ? customColors
              : { bg: "rgba(34,197,94,0.15)", border: "rgba(34,197,94,0.5)", text: "#22c55e" }
            : customColors && !isSelected
            ? { bg: customColors.bg, border: customColors.border, text: customColors.text + "99" }
            : getDefaultStyle(false);

          return (
            <button
              key={rank}
              disabled={disabled}
              onClick={() => onRankSelect(rank)}
              className="relative flex items-center justify-center rounded-lg font-black transition-all duration-150 select-none"
              style={{
                width: "36px",
                height: "36px",
                background: isSelected ? style.bg : "rgba(255,255,255,0.04)",
                border: `1.5px solid ${isSelected ? style.border : "rgba(255,255,255,0.09)"}`,
                color: isSelected ? style.text : customColors ? customColors.text + "66" : "rgba(255,255,255,0.4)",
                fontFamily: "'Rajdhani', sans-serif",
                fontSize: rank === "10" ? "11px" : "14px",
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.5 : 1,
                boxShadow: isSelected
                  ? `0 0 12px 2px ${style.border}55, inset 0 1px 0 rgba(255,255,255,0.1)`
                  : "none",
                transform: isSelected ? "scale(1.1)" : "scale(1)",
              }}
              aria-label={`Claim rank ${rank}`}
              aria-pressed={isSelected}
            >
              {rank}
              {isSelected && (
                <div
                  className="absolute -top-1 -right-1 rounded-full flex items-center justify-center"
                  style={{
                    width: "10px",
                    height: "10px",
                    background: style.text,
                    fontSize: "6px",
                    color: "#0a0e1a",
                    fontWeight: 900,
                  }}
                >
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
