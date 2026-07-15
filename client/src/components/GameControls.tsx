import { useState } from "react";
import { socket } from "../services/socket";
import type { Card } from "../types/socket.types";

interface Props {
  roomCode: string;
  selectedCards: Card[];
}

const ranks = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];

export default function GameControls({
  roomCode,
  selectedCards,
}: Props) {
  const [claimedRank, setClaimedRank] =
    useState("ACE");

  function play() {
    if (selectedCards.length === 0) {
      return;
    }

    socket.emit("play_cards", {
      roomCode,
      cards: selectedCards,
      claimedRank,
    });
  }

  function pass() {
    socket.emit("pass", {
      roomCode,
    });
  }

  function callBluff() {
    socket.emit("call_bluff", {
      roomCode,
    });
  }

  return (
    <div
      style={{
        border: "1px solid gray",
        padding: 20,
      }}
    >
      <h2>Play Cards</h2>

      <p>
        Selected Cards : {selectedCards.length}
      </p>

      <select
        value={claimedRank}
        onChange={(e) =>
          setClaimedRank(e.target.value)
        }
      >
        {ranks.map((rank) => (
          <option
            key={rank}
            value={rank}
          >
            {rank}
          </option>
        ))}
      </select>

      <button
        style={{ marginLeft: 10 }}
        onClick={play}
      >
        PLAY
      </button>

      <button
        style={{ marginLeft: 10 }}
        onClick={pass}
      >
        PASS
      </button>

      <button
        style={{ marginLeft: 10 }}
        onClick={callBluff}
        >
        CALL BLUFF
        </button>
    </div>
  );
}