import type { Card } from "../types/socket.types";

interface Props {
  card: Card;
  selected: boolean;
  onClick: () => void;
}

export default function CardView({
  card,
  selected,
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 70,
        height: 100,
        border: selected
          ? "3px solid green"
          : "1px solid black",
        borderRadius: 8,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        userSelect: "none",
        fontWeight: "bold",
        background: selected
          ? "#d4ffd4"
          : "white",
      }}
    >
      <div
        style={{
          textAlign: "center",
        }}
      >
        {card.rank}
        <br />
        {card.suit}
      </div>
    </div>
  );
}