import type { Card } from "../types/socket.types";

interface Props {
  hand: Card[];
}

export default function HandPanel({
  hand,
}: Props) {
  return (
    <div
      style={{
        border: "1px solid gray",
        padding: 20,
        marginBottom: 20,
      }}
    >
      <h2>Your Hand</h2>

      {hand.length === 0 ? (
        <p>No cards yet</p>
      ) : (
        <div
          style={{
            display: "flex",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          {hand.map((card, index) => (
            <div
              key={index}
              style={{
                width: 70,
                height: 100,
                border: "1px solid black",
                borderRadius: 8,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontWeight: "bold",
              }}
            >
              {card.rank}

              <br />

              {card.suit}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}