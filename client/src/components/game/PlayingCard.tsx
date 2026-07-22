import type { Card, Suit } from "@/lib/game-types";
import { cn } from "@/lib/utils";

interface PlayingCardProps {
  card?: Card;
  faceDown?: boolean;
  selected?: boolean;
  onClick?: () => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  floating?: boolean;
}

const SUIT_SYMBOLS: Record<Suit, string> = {
  spades: "♠",
  hearts: "♥",
  diamonds: "♦",
  clubs: "♣",
};

const RED_SUITS: Suit[] = ["hearts", "diamonds"];

function isRedSuit(suit: Suit): boolean {
  return RED_SUITS.includes(suit);
}

const SIZE_CONFIG = {
  sm: { width: "38px", height: "52px", rankSize: "12px", suitSize: "10px" },
  md: { width: "52px", height: "72px", rankSize: "16px", suitSize: "13px" },
  lg: { width: "72px", height: "100px", rankSize: "20px", suitSize: "17px" },
};

export function PlayingCard({
  card,
  faceDown = false,
  selected = false,
  onClick,
  size = "md",
  className,
  floating = false,
}: PlayingCardProps) {
  const config = SIZE_CONFIG[size];
  const isRed = card ? isRedSuit(card.suit) : false;

  if (faceDown || !card) {
    return (
      <div
        className={cn("relative rounded-lg cursor-pointer shrink-0", className)}
        style={{
          width: config.width,
          height: config.height,
          background: "linear-gradient(135deg, #1e3a5f 0%, #0f2040 100%)",
          border: "1.5px solid rgba(255,255,255,0.15)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
        onClick={onClick}
      >
        {/* Back pattern */}
        <div
          className="absolute inset-1.5 rounded-md"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, rgba(212,175,55,0.08) 0px, rgba(212,175,55,0.08) 1px, transparent 1px, transparent 6px), repeating-linear-gradient(-45deg, rgba(212,175,55,0.08) 0px, rgba(212,175,55,0.08) 1px, transparent 1px, transparent 6px)",
            border: "1px solid rgba(212,175,55,0.15)",
          }}
        />
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ fontSize: "10px", color: "rgba(212,175,55,0.25)", fontWeight: 900 }}
        >
          BV
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative rounded-lg shrink-0 transition-all duration-200",
        onClick ? "cursor-pointer" : "",
        floating ? "animate-card-float" : "",
        className
      )}
      style={{
        width: config.width,
        height: config.height,
        background: selected
          ? "linear-gradient(135deg, #fffdf0 0%, #fff9e0 100%)"
          : "linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)",
        border: selected
          ? "2px solid #d4af37"
          : "1.5px solid rgba(0,0,0,0.1)",
        boxShadow: selected
          ? "0 0 18px 4px rgba(212,175,55,0.5), 0 8px 20px rgba(0,0,0,0.5)"
          : "0 4px 12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.9)",
        transform: selected ? "translateY(-14px)" : "translateY(0)",
      }}
      onClick={onClick}
    >
      {/* Shine overlay */}
      <div
        className="absolute inset-0 rounded-lg pointer-events-none card-shine"
        style={{ zIndex: 1 }}
      />

      {/* Top-left rank + suit */}
      <div
        className="absolute top-1 left-1.5 flex flex-col items-center leading-none z-10"
        style={{ lineHeight: 1 }}
      >
        <span
          className="font-black"
          style={{
            fontSize: config.rankSize,
            color: isRed ? "#dc2626" : "#111827",
            fontFamily: "'Rajdhani', sans-serif",
            lineHeight: 1,
          }}
        >
          {card.rank}
        </span>
        <span
          style={{
            fontSize: config.suitSize,
            color: isRed ? "#dc2626" : "#111827",
            lineHeight: 1,
          }}
        >
          {SUIT_SYMBOLS[card.suit]}
        </span>
      </div>

      {/* Center suit */}
      <div
        className="absolute inset-0 flex items-center justify-center z-10"
        style={{
          fontSize: size === "lg" ? "28px" : size === "md" ? "20px" : "14px",
          color: isRed ? "#dc2626" : "#111827",
          opacity: 0.25,
        }}
      >
        {SUIT_SYMBOLS[card.suit]}
      </div>

      {/* Bottom-right rank + suit (inverted) */}
      <div
        className="absolute bottom-1 right-1.5 flex flex-col items-center leading-none z-10"
        style={{ transform: "rotate(180deg)", lineHeight: 1 }}
      >
        <span
          className="font-black"
          style={{
            fontSize: config.rankSize,
            color: isRed ? "#dc2626" : "#111827",
            fontFamily: "'Rajdhani', sans-serif",
            lineHeight: 1,
          }}
        >
          {card.rank}
        </span>
        <span
          style={{
            fontSize: config.suitSize,
            color: isRed ? "#dc2626" : "#111827",
            lineHeight: 1,
          }}
        >
          {SUIT_SYMBOLS[card.suit]}
        </span>
      </div>
    </div>
  );
}
