import type { GameState } from "../types/socket.types";

interface Props {
  gameState: GameState;
}

export default function GameStatusPanel({
  gameState,
}: Props) {
  return (
    <div
      style={{
        border: "1px solid gray",
        padding: 20,
        marginTop: 20,
      }}
    >
      <h2>Game Status</h2>

      <p>
  🎯 Current Turn :
    {" "}
    {gameState.currentTurnUsername ?? "-"}
    </p>

      <p>
        Claimed Rank :
        {" "}
        {gameState.claimedRank ?? "-"}
      </p>

      <hr />

      <h3>Last Move</h3>

      {gameState.lastMove ? (
        <>
          <p>
            Player :
            {" "}
            {gameState.lastMove.playerId}
          </p>

          <p>
            Claim :
            {" "}
            {gameState.lastMove.claimedRank}
          </p>

          <p>
            Cards :
            {" "}
            {gameState.lastMove.cardsPlayed}
          </p>
        </>
      ) : (
        <p>No moves yet</p>
      )}
    </div>
  );
}