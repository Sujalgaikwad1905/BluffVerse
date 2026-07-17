import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Card } from "../types/socket.types";
import CardView from "./CardView";
import GameControls from "./GameControls";

interface Props {
  roomCode: string;
  hand: Card[];
}

export default function HandPanel({
  roomCode,
  hand,
}: Props) {
  const [selectedCards, setSelectedCards] =
    useState<Card[]>([]);

  useEffect(() => {
    setSelectedCards([]);
  }, [hand]);

  function toggleCard(card: Card) {
    const exists = selectedCards.some(
      (c) =>
        c.rank === card.rank &&
        c.suit === card.suit
    );

    if (exists) {
      setSelectedCards((prev) =>
        prev.filter(
          (c) =>
            !(
              c.rank === card.rank &&
              c.suit === card.suit
            )
        )
      );
      return;
    }

    if (selectedCards.length >= 4) {
      return;
    }

    setSelectedCards((prev) => [
      ...prev,
      card,
    ]);
  }

  return (
    <div className="hand-wrap">
      <div className="hand-panel">
        <div className="hand-panel-head">
          <h2 className="hand-title">Your Hand</h2>
          {hand.length > 0 && (
            <span className="hand-count">{hand.length} cards</span>
          )}
        </div>

        <div className="hand-cards">
          <AnimatePresence mode="popLayout">
            {hand.length === 0 ? (
              <motion.div
                className="hand-empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="hand-empty-cards" aria-hidden>
                  <span className="ghost-card ghost-card-1" />
                  <span className="ghost-card ghost-card-2" />
                  <span className="ghost-card ghost-card-3" />
                </div>
                <p className="hand-empty-text">Cards incoming…</p>
                <p className="hand-empty-hint">Join & start a match to deal your hand</p>
              </motion.div>
            ) : (
              hand.map((card, index) => (
                <CardView
                  key={`${card.rank}-${card.suit}-${index}`}
                  card={card}
                  index={index}
                  totalCards={hand.length}
                  selected={selectedCards.some(
                    (c) =>
                      c.rank === card.rank &&
                      c.suit === card.suit
                  )}
                  onClick={() => toggleCard(card)}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      <GameControls
        roomCode={roomCode}
        selectedCards={selectedCards}
      />
    </div>
  );
}
