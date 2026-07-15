import { useEffect, useState } from "react";
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
    <>
      <div
        style={{
          border: "1px solid gray",
          padding: 20,
          marginBottom: 20,
        }}
      >
        <h2>Your Hand</h2>

        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          {hand.map((card, index) => (
            <CardView
              key={index}
              card={card}
              selected={selectedCards.some(
                (c) =>
                  c.rank === card.rank &&
                  c.suit === card.suit
              )}
              onClick={() =>
                toggleCard(card)
              }
            />
          ))}
        </div>
      </div>

      <GameControls
        roomCode={roomCode}
        selectedCards={selectedCards}
      />
    </>
  );
}