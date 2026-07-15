import { useState } from "react";

import ConnectionPanel from "../components/ConnectionPanel";
import LobbyPanel from "../components/LobbyPanel";
import HandPanel from "../components/HandPanel";
import GameStatusPanel from "../components/GameStatusPanel";

import { useSocket } from "../hooks/useSocket";

export default function DevPage() {
  const {
    connected,
    players,
    hand,
    gameState,
    winner,
  } = useSocket();


  
  const [roomCode, setRoomCode] =
    useState("");

    

  return (


    
    <div
      style={{
        width: 1000,
        margin: "40px auto",
        fontFamily: "sans-serif",
      }}
    >
      <h1>🎮 BluffVerse Developer Panel</h1>

      {winner && (
  <div
    style={{
      background: "green",
      color: "white",
      padding: 20,
      marginBottom: 20,
      fontSize: 28,
      fontWeight: "bold",
      textAlign: "center",
      borderRadius: 8,
    }}
  >
    🏆 Winner: {winner}
  </div>
)}

      

      <ConnectionPanel connected={connected} />

      <LobbyPanel
        roomCode={roomCode}
        setRoomCode={setRoomCode}
        players={players}
      />

      <HandPanel
        roomCode={roomCode}
        hand={hand}
      />

      <GameStatusPanel
        gameState={gameState}
      />
    </div>
  );
}