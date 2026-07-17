import ConnectionPanel from "../components/ConnectionPanel";

import LobbyPanel from "../components/LobbyPanel";

import HandPanel from "../components/HandPanel";

import GameStatusPanel from "../components/GameStatusPanel";

import WinnerModal from "../components/game/WinnerModal";

import { useSocket } from "../hooks/useSocket";

import "../styles/game.css";



interface Props {

  roomCode: string;

  username: string;

  userId: string;

}



export default function DevPage({

  roomCode,

  username,

  userId,

}: Props) {

  const {

    connected,

    players,

    hand,

    gameState,

    winner,

  } = useSocket();



  return (

    <div className="game-root">

      <div className="game-bg-glow" aria-hidden />



      <header className="game-header">

        <div className="game-brand">

          <span className="game-logo" aria-hidden>🎭</span>

          <div>

            <h1 className="game-title">BluffVerse</h1>

            <p className="game-tagline">Read minds. Lie better.</p>

          </div>

        </div>

        <ConnectionPanel connected={connected} />

      </header>



      <WinnerModal winner={winner} />



      <div className="game-layout">

        <LobbyPanel

          roomCode={roomCode}

          username={username}

          userId={userId}

          players={players}

          currentTurn={gameState.currentTurn}

        />



        <GameStatusPanel

          gameState={gameState}

          players={players}

          userId={userId}

        />

      </div>



      <div className="game-hand-section">

        <HandPanel roomCode={roomCode} hand={hand} />

      </div>

    </div>

  );

}

