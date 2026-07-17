import { motion } from "framer-motion";
import type { Player } from "../../types/socket.types";
import { getAvatarHue, getInitials } from "../../utils/avatar";

interface Props {
  player: Player;
  isSelf: boolean;
  isTurn: boolean;
}

export default function PlayerCard({
  player,
  isSelf,
  isTurn,
}: Props) {
  const hue = getAvatarHue(player.username);

  const classes = [
    "player-card",
    isTurn ? "is-turn" : "",
    isSelf ? "is-self" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <motion.div
      layout
      className={classes}
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      whileHover={{
        y: -3,
        scale: 1.015,
        transition: {
          duration: 0.18,
        },
      }}
      transition={{
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {isTurn && (
        <span
          className="player-card-turn-ring"
          aria-hidden
        />
      )}

      <div
        className="player-avatar"
        style={{
          backgroundColor: `hsl(${hue} 72% 48%)`,
        }}
      >
        {getInitials(player.username)}

        {player.isHost && (
          <span
            className="player-avatar-crown"
            title="Host"
          >
            👑
          </span>
        )}
      </div>

      <div className="player-card-body">

        <div className="player-card-top">

          <div className="player-card-name-row">

            <span className="player-card-name">
              {player.username}
            </span>

            {isSelf && (
              <span className="player-card-you">
                YOU
              </span>
            )}

          </div>

          <span
            className={`player-ready-badge ${
              player.ready ? "ready" : "waiting"
            }`}
          >
            {player.ready ? "LOCKED IN" : "THINKING"}
          </span>

        </div>

        <div className="player-card-meta">

          <span
            className="player-card-deck"
            aria-hidden
          >
            <span className="deck-chip" />
            <span className="deck-chip" />
            <span className="deck-chip" />
          </span>

          {isTurn && (
            <span className="player-turn-tag">
              ON MOVE
            </span>
          )}

        </div>

      </div>
    </motion.div>
  );
}