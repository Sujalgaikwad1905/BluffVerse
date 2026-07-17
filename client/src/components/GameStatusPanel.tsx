import { motion } from "framer-motion";
import type { GameState, Player } from "../types/socket.types";
import { getAvatarHue, getInitials } from "../utils/avatar";

interface Props {
  gameState: GameState;
  players: Player[];
  userId: string;
}

const SEAT_POSITIONS = ["top", "right", "bottom", "left"] as const;

function resolveUsername(
  playerId: string,
  players: Player[]
): string {
  return (
    players.find((p) => p.id === playerId)?.username ?? playerId
  );
}

export default function GameStatusPanel({
  gameState,
  players,
  userId,
}: Props) {
  const lastMove = gameState.lastMove;
  const lastMoveUsername = lastMove
    ? resolveUsername(lastMove.playerId, players)
    : null;
  const pileCount = lastMove?.cardsPlayed ?? 0;

  return (
    <div className="panel game-table-panel">
      <div className="game-arena-wrap">
        <div className="game-arena">
          <div className="arena-vignette" aria-hidden />
          <div className="arena-light" aria-hidden />

          <div className="table-seats">
            {players.map((player, i) => {
              const position =
                SEAT_POSITIONS[i % SEAT_POSITIONS.length];
              const isTurn = player.id === gameState.currentTurn;
              const isSelf = player.id === userId;
              const hue = getAvatarHue(player.username);

              return (
                <motion.div
                  key={player.id}
                  className={[
                    "table-seat",
                    position,
                    isTurn ? "is-turn" : "",
                    isSelf ? "is-self" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.35 }}
                >
                  {isTurn && (
                    <span className="table-seat-turn-pulse" aria-hidden />
                  )}

                  <div
                    className="player-avatar player-avatar-sm"
                    style={{
                      background: `linear-gradient(135deg, hsl(${hue} 68% 52%) 0%, hsl(${hue} 58% 38%) 100%)`,
                    }}
                  >
                    {getInitials(player.username)}
                  </div>

                  <p className="table-seat-name">
                    {player.username}
                  </p>

                  <div className="table-seat-meta">
                    <span className="player-card-deck" aria-hidden>
                      <span className="deck-chip" />
                      <span className="deck-chip" />
                    </span>
                    <span className="table-seat-badge">
                      {isSelf
                        ? "You"
                        : isTurn
                          ? "Playing"
                          : player.ready
                            ? "Ready"
                            : "Idle"}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="table-center">
            <motion.div
              className="current-turn-banner"
              animate={
                gameState.currentTurnUsername
                  ? { boxShadow: "0 0 24px rgba(251, 191, 36, 0.35)" }
                  : { boxShadow: "0 0 0 transparent" }
              }
              transition={{ duration: 0.4 }}
            >
              <p className="current-turn-label">
    🎯 CURRENT TURN
</p>
              <motion.p
                className={`current-turn-name ${gameState.currentTurnUsername ? "active" : ""}`}
                key={gameState.currentTurnUsername ?? "none"}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
              >
                {gameState.currentTurnUsername ?? "—"}
              </motion.p>
            </motion.div>

            <motion.div
              className="claim-token"
              key={gameState.claimedRank ?? "none"}
              initial={{ scale: 0.7, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
            >
              <span className="claim-token-label">
                    🃏 CLAIM
                </span>
              <span className="claim-token-value">
                {gameState.claimedRank ?? "—"}
              </span>
            </motion.div>

            <motion.div
              className="discard-pile"
              animate={{
                boxShadow:
                  pileCount > 0
                    ? "0 0 32px rgba(251, 191, 36, 0.28), 0 8px 24px rgba(0,0,0,0.4)"
                    : "0 0 16px rgba(251, 191, 36, 0.12)",
              }}
              transition={{ duration: 0.35 }}
            >
              <div className="discard-card discard-card-back" />
              <div className="discard-card discard-card-back" />
              <motion.div
                className="discard-card discard-card-top"
                key={pileCount}
                initial={{ scale: 0.9, rotate: -6 }}
                animate={{ scale: 1, rotate: pileCount > 0 ? 3 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 24 }}
              >
                {pileCount > 0 ? (
                  <span className="pile-count">{pileCount}</span>
                ) : (
                  <span className="pile-idle">?</span>
                )}
              </motion.div>
            </motion.div>

            <div className="last-move">
            <p className="last-move-label">
                  🎭 LAST BLUFF
              </p>
              {lastMove ? (
                <motion.p
                  className="last-move-text"
                  key={`${lastMove.playerId}-${lastMove.cardsPlayed}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <strong>{lastMoveUsername}</strong> dropped{" "}
                  <strong>{lastMove.cardsPlayed}</strong> claiming{" "}
                  <strong>{lastMove.claimedRank}</strong>
                </motion.p>
              ) : (
                <p className="last-move-text last-move-empty">
                  <span className="last-move-icon" aria-hidden>🎭</span>
                  The bluffing begins here
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
