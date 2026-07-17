import { useState } from "react";

import HomePage from "./pages/HomePage";
import DevPage from "./pages/DevPage";

export default function App() {
  const [joined, setJoined] =
    useState(false);

  const [joinData, setJoinData] =
    useState({
      roomCode: "",
      username: "",
      userId: "",
    });

  if (!joined) {
    return (
      <HomePage
        onJoin={(
          roomCode,
          username,
          userId
        ) => {
          setJoinData({
            roomCode,
            username,
            userId,
          });

          setJoined(true);
        }}
      />
    );
  }

  return (
    <DevPage
      roomCode={joinData.roomCode}
      username={joinData.username}
      userId={joinData.userId}
    />
  );
}