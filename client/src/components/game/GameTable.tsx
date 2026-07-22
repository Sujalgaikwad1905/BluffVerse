import type { Card, Claim, Player } from "@/lib/game-types";
import { PlayingCard } from "./PlayingCard";
import { Layers } from "lucide-react";

interface GameTableProps {
  discardPile: Card[];
  currentClaim: Claim | null;
  lastPlayedCards: Card[];
  players: Player[];
  onTableAreaClick?: () => void;
}

function OpponentSeat({ player }: { player: Player }) {
  return (
    <div
      className="absolute flex flex-col items-center gap-1.5"
      style={getSeatPosition(player.position)}
    >
      {/* Face-down cards fanned */}
      <div className="flex items-center" style={{ gap: "-8px" }}>
        {Array.from({ length: Math.min(player.cardCount, 5) }).map((_, i) => (
          <div
            key={i}
            className="relative"
            style={{
              marginLeft: i === 0 ? 0 : "-16px",
              transform: `rotate(${(i - 2) * 4}deg)`,
              zIndex: i,
            }}
          >
            <PlayingCard faceDown size="sm" />
          </div>
        ))}
        {player.cardCount > 5 && (
          <div
            className="ml-1 flex items-center justify-center rounded-full text-xs font-bold"
            style={{
              width: "20px",
              height: "20px",
              background: "rgba(212,175,55,0.2)",
              border: "1px solid rgba(212,175,55,0.4)",
              color: "#d4af37",
              fontSize: "10px",
              fontFamily: "'Rajdhani', sans-serif",
            }}
          >
            +{player.cardCount - 5}
          </div>
        )}
      </div>

      {/* Player label */}
      <div
        className="flex items-center gap-1.5 px-2 py-1 rounded-full"
        style={{
          background: player.isCurrentTurn
            ? "rgba(34,197,94,0.15)"
            : "rgba(10,14,26,0.75)",
          border: player.isCurrentTurn
            ? "1px solid rgba(34,197,94,0.5)"
            : "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(8px)",
          boxShadow: player.isCurrentTurn
            ? "0 0 10px 2px rgba(34,197,94,0.2)"
            : "none",
        }}
      >
        {player.isCurrentTurn && (
          <span style={{ fontSize: "8px", color: "#22c55e" }}>▶</span>
        )}
        <span
          className="text-xs font-semibold"
          style={{
            color: player.isCurrentTurn ? "#fff" : "rgba(255,255,255,0.7)",
            fontFamily: "'Rajdhani', sans-serif",
            fontSize: "11px",
          }}
        >
          {player.username}
        </span>
        <span
          className="text-xs font-bold"
          style={{
            color: player.isCurrentTurn ? "#22c55e" : "rgba(255,255,255,0.4)",
            fontFamily: "'Rajdhani', sans-serif",
          }}
        >
          {player.cardCount}
        </span>
      </div>
    </div>
  );
}

function getSeatPosition(position: Player["position"]): React.CSSProperties {
  switch (position) {
    case "top":
      return { top: "12px", left: "50%", transform: "translateX(-50%)", flexDirection: "column-reverse" };
    case "left":
      return { left: "12px", top: "50%", transform: "translateY(-50%)" };
    case "right":
      return { right: "12px", top: "50%", transform: "translateY(-50%)" };
    default:
      return { bottom: "12px", left: "50%", transform: "translateX(-50%)" };
  }
}

export function GameTable({
  discardPile,
  currentClaim,
  lastPlayedCards,
  players,
  onTableAreaClick,
}: GameTableProps) {
  const opponents = players.filter((p) => !p.isLocalPlayer);

  return (
    <div
      className="relative flex-1 felt-texture overflow-hidden"
      style={{
        boxShadow:
          "inset 0 0 80px 20px rgba(0,0,0,0.5), inset 0 0 20px rgba(0,0,0,0.3)",
        borderRadius: "0",
      }}
      onClick={onTableAreaClick}
    >
      {/* Oval table edge */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: "16px",
          borderRadius: "50%",
          border: "2px solid rgba(212,175,55,0.12)",
          boxShadow:
            "0 0 0 1px rgba(212,175,55,0.06), inset 0 0 60px rgba(0,0,0,0.25)",
        }}
      />

      {/* Table inner glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: "40px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse at center, rgba(26,92,46,0) 0%, rgba(14,40,20,0.4) 100%)",
        }}
      />

      {/* Opponents around the table */}
      {opponents.map((player) => (
        <OpponentSeat key={player.id} player={player} />
      ))}

      {/* Center area */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-5">
          {/* Current Claim */}
          {currentClaim && (
            <div
              className="flex flex-col items-center gap-2 animate-claim-pop"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase"
                style={{
                  background: "rgba(212,175,55,0.12)",
                  border: "1px solid rgba(212,175,55,0.3)",
                  color: "rgba(212,175,55,0.8)",
                  fontFamily: "'Rajdhani', sans-serif",
                  letterSpacing: "0.15em",
                  backdropFilter: "blur(8px)",
                }}
              >
                Current Claim
              </div>
              <div
                className="flex items-center gap-3 px-5 py-3 rounded-2xl"
                style={{
                  background: "rgba(10,14,26,0.75)",
                  border: "1px solid rgba(212,175,55,0.25)",
                  backdropFilter: "blur(12px)",
                  boxShadow:
                    "0 4px 24px rgba(0,0,0,0.5), 0 0 0 1px rgba(212,175,55,0.08)",
                }}
              >
                <div className="flex flex-col items-center">
                  <span
                    className="font-black"
                    style={{
                      fontSize: "36px",
                      color: "#d4af37",
                      fontFamily: "'Rajdhani', sans-serif",
                      lineHeight: 1,
                    }}
                  >
                    {currentClaim.quantity}×
                  </span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px" }}
                  >
                    cards
                  </span>
                </div>
                <div
                  className="w-px self-stretch"
                  style={{ background: "rgba(212,175,55,0.2)" }}
                />
                <div className="flex flex-col items-center">
                  <span
                    className="font-black"
                    style={{
                      fontSize: "36px",
                      color: "#fff",
                      fontFamily: "'Rajdhani', sans-serif",
                      lineHeight: 1,
                    }}
                  >
                    {currentClaim.rank}
                  </span>
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px" }}
                  >
                    rank
                  </span>
                </div>
              </div>
              <div
                className="text-xs font-medium"
                style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Rajdhani', sans-serif" }}
              >
                by {currentClaim.playerUsername}
              </div>
            </div>
          )}

          {/* No claim yet */}
          {!currentClaim && (
            <div
              className="flex flex-col items-center gap-2"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              <div
                className="rounded-full flex items-center justify-center"
                style={{
                  width: "56px",
                  height: "56px",
                  border: "2px dashed rgba(255,255,255,0.1)",
                }}
              >
                <Layers size={20} style={{ opacity: 0.4 }} />
              </div>
              <span
                className="text-xs font-semibold tracking-widest uppercase"
                style={{ fontFamily: "'Rajdhani', sans-serif", letterSpacing: "0.15em" }}
              >
                No claim yet
              </span>
            </div>
          )}

          {/* Last Played Cards */}
          {lastPlayedCards.length > 0 && (
            <div className="flex flex-col items-center gap-2">
              <div
                className="text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full"
                style={{
                  color: "rgba(255,255,255,0.35)",
                  background: "rgba(255,255,255,0.04)",
                  fontFamily: "'Rajdhani', sans-serif",
                  fontSize: "10px",
                }}
              >
                Last Played
              </div>
              <div className="flex items-center gap-1">
                {lastPlayedCards.map((card, i) => (
                  <div
                    key={card.id}
                    style={{ transform: `rotate(${(i - 0.5) * 5}deg)`, marginLeft: i > 0 ? "-8px" : 0 }}
                  >
                    <PlayingCard card={card} faceDown size="sm" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Discard Pile (bottom-right) */}
      <div
        className="absolute bottom-16 right-20 flex flex-col items-center gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative" style={{ width: "52px", height: "72px" }}>
          {discardPile.slice(-4).map((_, i, arr) => (
            <div
              key={i}
              className="absolute"
              style={{
                top: `${-i * 1.5}px`,
                left: `${-i * 0.5}px`,
                transform: `rotate(${(i - arr.length / 2) * 3}deg)`,
                zIndex: i,
              }}
            >
              <PlayingCard faceDown size="md" />
            </div>
          ))}
        </div>

        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded-full"
          style={{
            background: "rgba(10,14,26,0.7)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(8px)",
          }}
        >
          <Layers size={11} style={{ color: "rgba(255,255,255,0.4)" }} />
          <span
            className="text-xs font-bold"
            style={{
              color: "rgba(255,255,255,0.6)",
              fontFamily: "'Rajdhani', sans-serif",
            }}
          >
            {discardPile.length}
          </span>
          <span
            className="text-xs"
            style={{ color: "rgba(255,255,255,0.3)", fontSize: "10px" }}
          >
            discard
          </span>
        </div>
      </div>

      {/* Subtle corner decorations */}
      {(["tl", "tr", "bl", "br"] as const).map((corner) => (
        <div
          key={corner}
          className="absolute pointer-events-none"
          style={{
            top: corner.startsWith("t") ? "8px" : "auto",
            bottom: corner.startsWith("b") ? "8px" : "auto",
            left: corner.endsWith("l") ? "8px" : "auto",
            right: corner.endsWith("r") ? "8px" : "auto",
            width: "20px",
            height: "20px",
            borderTop: corner.startsWith("t") ? "1px solid rgba(212,175,55,0.15)" : "none",
            borderBottom: corner.startsWith("b") ? "1px solid rgba(212,175,55,0.15)" : "none",
            borderLeft: corner.endsWith("l") ? "1px solid rgba(212,175,55,0.15)" : "none",
            borderRight: corner.endsWith("r") ? "1px solid rgba(212,175,55,0.15)" : "none",
          }}
        />
      ))}
    </div>
  );
}
