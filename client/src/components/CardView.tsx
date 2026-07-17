import { motion } from "framer-motion";
import type { Card } from "../types/socket.types";

interface Props {
  card: Card;
  selected: boolean;
  onClick: () => void;
  index?: number;
  totalCards: number;
}

const RED_SUITS = new Set(["♥", "♦", "hearts", "diamonds"]);


function suitSymbol(suit: string) {
  switch (suit.toLowerCase()) {
    case "hearts":
      return "♥";

    case "diamonds":
      return "♦";

    case "clubs":
      return "♣";

    case "spades":
      return "♠";

    default:
      return suit;
  }
}

function isRedSuit(suit: string) {
  return RED_SUITS.has(suit) || suit.includes("♥") || suit.includes("♦");
}

export default function CardView({
  card,
  selected,
  onClick,
  index = 0,
  totalCards,
}: Props) {
  const colorClass = isRedSuit(card.suit) ? "red" : "black";
  const center = (totalCards - 1) / 2;

  const fanRotate = (index - center) * 3;
  const fanY = Math.abs(index - 2.5) * 3;

  return (
    <motion.div
      className={`playing-card ${colorClass} ${selected ? "selected" : ""}`}
      onClick={onClick}
      layout
      style={{ zIndex: selected ? 30 : index + 1 }}
      initial={{ opacity: 0, y: 48, rotate: fanRotate - 8, scale: 0.85 }}
      animate={{
        opacity: 1,
        y: selected ? -28 : fanY,
        rotate: selected ? 0 : fanRotate,
        scale: selected ? 1.08 : 1,
      }}
      whileHover={
        selected
          ? { y: -30, transition: { duration: 0.12 } }
          : {
              y: fanY - 14,
              rotate: fanRotate * 0.6,
              scale: 1.05,
              transition: { duration: 0.16, ease: "easeOut" },
            }
      }
      whileTap={{ scale: selected ? 1.04 : 0.97 }}
      transition={{
        type: "spring",
        stiffness: 420,
        damping: 28,
        delay: index * 0.045,
      }}
    >
      <div className="card-shine" aria-hidden />
      <div className="card-rank">{card.rank}</div>
      <div className="card-suit">
          {suitSymbol(card.suit)}
      </div>
      <div className="card-rank-bottom">{card.rank}</div>
    </motion.div>
  );
}
