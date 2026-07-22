import type { Card } from "@/lib/game-types";
import { PlayingCard } from "./PlayingCard";

interface PlayerHandProps {
  cards: Card[];
  selectedCards: Set<string>;
  onCardSelect: (cardId: string) => void;
  isMyTurn: boolean;
}

export function PlayerHand({
  cards,
  selectedCards,
  onCardSelect,
  isMyTurn,
}: PlayerHandProps) {
  const count = cards.length;

  // Calculate fan spread angles
  const spread = Math.min(count * 5, 50);
  const getRotation = (index: number) => {
    if (count <= 1) return 0;
    return -spread / 2 + (spread / (count - 1)) * index;
  };
  const getTranslateY = (index: number) => {
    if (count <= 1) return 0;
    const mid = (count - 1) / 2;
    const distance = Math.abs(index - mid) / mid;
    return distance * distance * 10;
  };

  return (
    <div
      className="shrink-0 flex flex-col"
      style={{
        height: "130px",
        background: "linear-gradient(180deg, rgba(10,14,26,0) 0%, rgba(10,14,26,0.95) 20%, rgba(10,14,26,1) 100%)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        position: "relative",
        overflow: "visible",
      }}
    >
      {/* Hand label */}
      <div
        className="absolute top-2 left-4 flex items-center gap-2"
        style={{ zIndex: 20 }}
      >
        <div
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-full"
          style={{
            background: isMyTurn ? "rgba(34,197,94,0.12)" : "rgba(255,255,255,0.04)",
            border: `1px solid ${isMyTurn ? "rgba(34,197,94,0.3)" : "rgba(255,255,255,0.08)"}`,
          }}
        >
          {isMyTurn && (
            <span style={{ fontSize: "8px", color: "#22c55e" }}>▶</span>
          )}
          <span
            className="text-xs font-bold tracking-widest uppercase"
            style={{
              color: isMyTurn ? "#22c55e" : "rgba(255,255,255,0.35)",
              fontFamily: "'Rajdhani', sans-serif",
              fontSize: "10px",
              letterSpacing: "0.12em",
            }}
          >
            {isMyTurn ? "Your Turn" : "Your Hand"}
          </span>
        </div>
        <span
          className="text-xs font-bold"
          style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Rajdhani', sans-serif" }}
        >
          {count} cards
        </span>
        {selectedCards.size > 0 && (
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full animate-slide-in-up"
            style={{
              background: "rgba(212,175,55,0.15)",
              border: "1px solid rgba(212,175,55,0.4)",
            }}
          >
            <span
              className="text-xs font-bold"
              style={{ color: "#d4af37", fontFamily: "'Rajdhani', sans-serif" }}
            >
              {selectedCards.size} selected
            </span>
          </div>
        )}
      </div>

      {/* Cards fan */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-end justify-center"
        style={{
          paddingBottom: "8px",
          height: "130px",
        }}
      >
        <div
          className="relative flex items-end justify-center"
          style={{
            height: "110px",
            width: `${Math.max(count * 44, 200)}px`,
            maxWidth: "90%",
          }}
        >
          {cards.map((card, i) => {
            const selected = selectedCards.has(card.id);
            const rotation = getRotation(i);
            const translateY = getTranslateY(i);

            return (
              <div
                key={card.id}
                className="absolute transition-all duration-200"
                style={{
                  bottom: `${translateY}px`,
                  left: `${(i / Math.max(count - 1, 1)) * 100}%`,
                  transform: `translateX(-50%) rotate(${rotation}deg) ${selected ? "translateY(-14px)" : ""}`,
                  transformOrigin: "bottom center",
                  zIndex: selected ? count + i + 10 : i,
                  filter: isMyTurn
                    ? selected
                      ? "drop-shadow(0 0 8px rgba(212,175,55,0.7))"
                      : "drop-shadow(0 4px 8px rgba(0,0,0,0.6))"
                    : "drop-shadow(0 4px 8px rgba(0,0,0,0.5)) brightness(0.85)",
                }}
                onMouseEnter={(e) => {
                  if (!selected) {
                    (e.currentTarget as HTMLDivElement).style.zIndex = String(count + 20);
                    (e.currentTarget as HTMLDivElement).style.transform = `translateX(-50%) rotate(${rotation}deg) translateY(-8px)`;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!selected) {
                    (e.currentTarget as HTMLDivElement).style.zIndex = String(i);
                    (e.currentTarget as HTMLDivElement).style.transform = `translateX(-50%) rotate(${rotation}deg)`;
                  }
                }}
                onClick={() => isMyTurn && onCardSelect(card.id)}
              >
                <PlayingCard
                  card={card}
                  selected={selected}
                  size="lg"
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
