import { useState } from "react";

import Button from "../components/common/Button";

import "../styles/game.css";



interface Props {

  onJoin: (

    roomCode: string,

    username: string,

    userId: string

  ) => void;

}



export default function HomePage({

  onJoin,

}: Props) {

  const [roomCode, setRoomCode] = useState("");

  const [username, setUsername] = useState("");

  const [userId, setUserId] = useState("");



  return (

    <div className="home-root">

      <div className="home-bg-glow" aria-hidden />

      <div className="home-card">

        <div className="home-logo" aria-hidden>🎭</div>

        <h1>BluffVerse</h1>

        <p className="home-subtitle">

          Fast multiplayer bluffing — no poker tables, just chaos.

        </p>



        <input

          className="home-input"

          placeholder="Room Code"

          value={roomCode}

          onChange={(e) =>

            setRoomCode(e.target.value)

          }

        />



        <input

          className="home-input"

          placeholder="Username"

          value={username}

          onChange={(e) =>

            setUsername(e.target.value)

          }

        />



        <input

          className="home-input"

          placeholder="User ID"

          value={userId}

          onChange={(e) =>

            setUserId(e.target.value)

          }

        />



        <Button

          variant="join"

          style={{ width: "100%", marginTop: 10 }}

          onClick={() =>

            onJoin(roomCode, username, userId)

          }

        >

          Enter Arena

        </Button>

      </div>

    </div>

  );

}

