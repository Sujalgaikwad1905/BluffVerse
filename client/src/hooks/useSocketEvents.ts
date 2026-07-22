import { useEffect } from "react";
import { socket } from "@/socket/socket";
import { useGameStore } from "@/store/gameStore";

export function useSocketEvents() {
  const setPlayers = useGameStore((state) => state.setPlayers);
  const setPlayerCount = useGameStore((state) => state.setPlayerCount);
  const setMyHand = useGameStore((state) => state.setMyHand);
  const setCurrentTurn = useGameStore((state) => state.setCurrentTurn);
  const setClaimedRank = useGameStore((state) => state.setClaimedRank);
  const userId = useGameStore((state) => state.userId);

  useEffect(() => {
    socket.on("player_list", (players) => {
      setPlayers(
        players.map((player: any) => ({
          id: player.id,
          username: player.username,
          avatar: "",
          isHost: player.isHost,
          isReady: player.ready,
          isConnected: true,

          // We'll fix this properly after login/user state is added.
          isLocalPlayer: player.id === userId,
        }))
      );
    });

    socket.on("player_count", ({ playerCount }) => {
      setPlayerCount(playerCount);
    });

    socket.on("your_hand", ({ cards }) => {
      setMyHand(cards);
    });

    socket.on(
      "game_started",
      ({ currentTurn, claimedRank }) => {
        setCurrentTurn(currentTurn);
        setClaimedRank(claimedRank);
      }
    );

    return () => {
      socket.off("player_list");
      socket.off("player_count");
      socket.off("your_hand");
      socket.off("game_started");
    };
}, [
    userId,
    setPlayers,
    setPlayerCount,
    setMyHand,
    setCurrentTurn,
    setClaimedRank,
  ]);
}