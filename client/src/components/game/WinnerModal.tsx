import { motion, AnimatePresence } from "framer-motion";
import Button from "../common/Button";

interface Props {
  winner: string | null;
}

const CONFETTI = Array.from({ length: 28 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 7) % 100}%`,
  delay: (i % 7) * 0.12,
  hue: (i * 47) % 360,
  size: 6 + (i % 4) * 2,
}));

function reload() {
  window.location.reload();
}

export default function WinnerModal({ winner }: Props) {
  return (
    <AnimatePresence>
      {winner && (
        <motion.div
          className="winner-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div className="winner-confetti" aria-hidden>
            {CONFETTI.map((piece) => (
              <span
                key={piece.id}
                className="confetti-piece"
                style={{
                  left: piece.left,
                  animationDelay: `${piece.delay}s`,
                  background: `hsl(${piece.hue} 85% 58%)`,
                  width: piece.size,
                  height: piece.size * 1.4,
                }}
              />
            ))}
          </div>

          <motion.div
            className="winner-modal"
            initial={{ scale: 0.88, opacity: 0, y: 32 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            transition={{
              type: "spring",
              stiffness: 280,
              damping: 24,
            }}
          >
            <motion.div
              className="winner-trophy"
              animate={{
                y: [0, -6, 0],
                rotate: [0, -4, 4, 0],
              }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              🏆
            </motion.div>

            <p className="winner-eyebrow">Match complete</p>
            <h2 className="winner-heading">Winner</h2>
            <p className="winner-name">{winner}</p>
            <p className="winner-sub">Out-bluffed everyone at the table.</p>

            <div className="winner-actions">
              <Button variant="play" onClick={reload}>
                Play Again
              </Button>
              <Button variant="pass" onClick={reload}>
                Exit
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
