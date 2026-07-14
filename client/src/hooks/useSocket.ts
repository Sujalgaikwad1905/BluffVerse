import { useEffect, useState } from "react";
import { socket } from "../services/socket";
import type {
    Player,
    Card,
    EventLog,
    GameState,
  } from "../types/socket.types";

export function useSocket() {
  const [connected, setConnected] = useState(false);

  const [players, setPlayers] = useState<Player[]>([]);

  const [hand, setHand] = useState<Card[]>([]);

  const [gameState, setGameState] =
    useState<GameState>({});

  const [logs, setLogs] = useState<EventLog[]>([]);

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
        claimedRank: data.claimedRank,
      }));

      addLog("Turn changed");
    });

    socket.on("cards_played", () => {
      addLog("Cards played");
    });

    socket.on("bluff_resolved", () => {
      addLog("Bluff resolved");
    });

    socket.on("game_started", () => {
      addLog("Game started");
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
  };
}