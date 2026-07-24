import { useEffect } from "react";
import type { Card, Rank } from "@/lib/game-types";
import { socket } from "@/socket/socket";
import { useGameStore } from "@/store/gameStore";

export function useSocketEvents() {
  const setPlayers = useGameStore((state) => state.setPlayers);
  const setPlayerCount = useGameStore((state) => state.setPlayerCount);
  const setMyHand = useGameStore((state) => state.setMyHand);
  const setCurrentTurn = useGameStore((state) => state.setCurrentTurn);
  const setClaimedRank = useGameStore((state) => state.setClaimedRank);
  const setCurrentClaim = useGameStore((state) => state.setCurrentClaim);
  const setDiscardPile = useGameStore((state) => state.setDiscardPile);
  const setLastPlayedCards = useGameStore((state) => state.setLastPlayedCards);
  const setRoundMessage = useGameStore((state) => state.setRoundMessage);
  const userId = useGameStore((state) => state.userId);

  useEffect(() => {
    const handlePlayerList = (incomingPlayers: Array<{ id: string; username: string; isHost: boolean; ready: boolean }>) => {
      setPlayers(
        incomingPlayers.map((player) => ({
          id: player.id,
          username: player.username,
          avatar: "",
          isHost: player.isHost,
          isReady: player.ready,
          isConnected: true,
          isLocalPlayer: player.id === userId,
        }))
      );
    };

    const handlePlayerCount = ({ playerCount }: { playerCount: number }) => {
      setPlayerCount(playerCount);
    };

    const handleYourHand = ({ cards }: { cards: Card[] }) => {
      setMyHand(cards);
    };

    const handleGameStarted = ({ currentTurn, claimedRank }: { currentTurn: string | null; claimedRank: Rank | null }) => {
      setCurrentTurn(currentTurn);
      setClaimedRank(claimedRank);
      setCurrentClaim(null);
      setDiscardPile([]);
      setLastPlayedCards([]);
      setRoundMessage(null);
    };

    socket.on("player_list", handlePlayerList);
    socket.on("player_count", handlePlayerCount);
    socket.on("your_hand", handleYourHand);
    socket.on("game_started", handleGameStarted);

    return () => {
      socket.off("player_list", handlePlayerList);
      socket.off("player_count", handlePlayerCount);
      socket.off("your_hand", handleYourHand);
      socket.off("game_started", handleGameStarted);
    };
  }, [
    userId,
    setPlayers,
    setPlayerCount,
    setMyHand,
    setCurrentTurn,
    setClaimedRank,
    setCurrentClaim,
    setDiscardPile,
    setLastPlayedCards,
    setRoundMessage,
  ]);
}