import { useEffect, useState } from "react";
import { socket } from "../services/socket";

import type {
  Player,
  Card,
  EventLog,
  GameState,
  LastMove,
} from "../types/socket.types";

export function useSocket() {
  const [connected, setConnected] = useState(false);


  const [winner, setWinner] = useState<string | null>(null);

  const [players, setPlayers] = useState<Player[]>([]);

  const [hand, setHand] = useState<Card[]>([]);

  const [gameState, setGameState] =
    useState<GameState>({});

  const [logs, setLogs] =
    useState<EventLog[]>([]);

  function addLog(message: string) {
    setLogs((prev) => [
      ...prev,
      {
        id: Date.now(),
        message,
      },
    ]);
  }

  useEffect(() => {



    socket.on(
      "game_over",
      ({ winnerUsername }) => {
        setWinner(winnerUsername);
      }
    );
    socket.on("connect", () => {
      setConnected(true);
      addLog("Connected");
    });

    socket.on("disconnect", () => {
      setConnected(false);
      addLog("Disconnected");
    });

    socket.on("player_list", (players: Player[]) => {
      setPlayers(players);
      addLog("Player list updated");
    });

    socket.on("your_hand", (data) => {
      setHand(data.cards);
      addLog("Received cards");
    });

    socket.on("turn_changed", (data) => {
      setGameState((prev) => ({
        ...prev,
        currentTurn: data.currentTurn,
        currentTurnUsername:
          data.currentTurnUsername,
        claimedRank: data.claimedRank,
      }));
    
      addLog(
        `Turn changed to ${data.currentTurnUsername}`
      );
    });

    socket.on("cards_played", (data: LastMove) => {
      setGameState((prev) => ({
        ...prev,
        lastMove: data,
      }));

      addLog(
        `${data.playerId} played ${data.cardsPlayed} cards claiming ${data.claimedRank}`
      );
    });

    socket.on("bluff_resolved", () => {
      addLog("Bluff resolved");
    });

    socket.on("game_started", (data) => {
      setGameState((prev) => ({
        ...prev,
        currentTurn: data.currentTurn,
        currentTurnUsername:
          data.currentTurnUsername,
        claimedRank: data.claimedRank,
      }));
    
      addLog(
        `Game started. ${data.currentTurnUsername}'s turn`
      );
    });

    return () => {
      socket.removeAllListeners();
    };
  }, []);

  return {
    socket,
    connected,
    players,
    hand,
    gameState,
    logs,
    winner,
  };
}