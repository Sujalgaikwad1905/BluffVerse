import { useState } from "react";
import { socket } from "../services/socket";
import type { Card } from "../types/socket.types";
import Button from "./common/Button";

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
    <div className="controls-bar">
      <div className="controls-info">
        <span className="controls-info-label">Selected</span>
        <strong>{selectedCards.length}</strong>
        <span className="controls-info-max">/ 4</span>
      </div>

      <div className="controls-select-wrap">
        <label htmlFor="claimed-rank">Claim as</label>
        <select
          id="claimed-rank"
          className="controls-select"
          value={claimedRank}
          onChange={(e) =>
            setClaimedRank(e.target.value)
          }
        >
          {ranks.map((rank) => (
            <option key={rank} value={rank}>
              {rank}
            </option>
          ))}
        </select>
      </div>

      <div className="controls-actions">
        <Button
          variant="play"
          onClick={play}
          disabled={selectedCards.length === 0}
        >
          Play
        </Button>
        <Button variant="pass" onClick={pass}>
          Pass
        </Button>
        <Button variant="bluff" onClick={callBluff}>
          Call Bluff
        </Button>
      </div>
    </div>
  );
}
