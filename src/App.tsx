import { useState } from "react";
import { GameScreen } from "@/components/game/GameScreen";
import { WaitingRoom } from "@/components/lobby/WaitingRoom";

type View = "lobby" | "game";

export function App() {
  const [view, setView] = useState<View>("lobby");

  if (view === "game") {
    return <GameScreen onLeave={() => setView("lobby")} />;
  }

  return <WaitingRoom onStartGame={() => setView("game")} />;
}
