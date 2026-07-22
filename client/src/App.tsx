import { useState, useEffect } from "react";
import { GameScreen } from "@/components/game/GameScreen";
import { WaitingRoom } from "@/components/lobby/WaitingRoom";
import { JoinRoom } from "@/components/lobby/JoinRoom";
import { useSocketEvents } from "@/hooks/useSocketEvents";
import { useGameStore } from "@/store/gameStore";

type View = "join" | "lobby" | "game";

export function App() {
  const [view, setView] = useState<View>("join");

  useSocketEvents();

  const currentTurn = useGameStore((state) => state.currentTurn);

  useEffect(() => {
    if (currentTurn) {
      setView("game");
    }
  }, [currentTurn]);

  if (view === "join") {
    return <JoinRoom onJoin={() => setView("lobby")} />;
  }

  if (view === "game") {
    return <GameScreen onLeave={() => setView("join")} />;
  }

  return <WaitingRoom />;
}