import type { Player } from "@/lib/game-types";
import { PlayerCard } from "./PlayerCard";
import { Users } from "lucide-react";

interface PlayerSidebarProps {
  players: Player[];
}

export function PlayerSidebar({ players }: PlayerSidebarProps) {
  const activePlayers = players.filter((p) => !p.isEliminated);
  const eliminatedPlayers = players.filter((p) => p.isEliminated);

  return (
    <aside
      className="flex flex-col shrink-0"
      style={{
        width: "100px",
        background: "rgba(10,14,26,0.8)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        padding: "8px 6px",
        gap: "0",
        overflowY: "auto",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-1.5 mb-3 px-1"
        style={{ color: "rgba(255,255,255,0.35)" }}
      >
        <Users size={12} />
        <span
          className="text-xs font-bold tracking-widest uppercase"
          style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "10px" }}
        >
          Players
        </span>
      </div>

      {/* Active players */}
      <div className="flex flex-col gap-2">
        {activePlayers.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>

      {/* Eliminated divider */}
      {eliminatedPlayers.length > 0 && (
        <>
          <div
            className="my-3 mx-1"
            style={{
              height: "1px",
              background: "rgba(239,68,68,0.15)",
            }}
          />
          <div
            className="flex items-center gap-1 mb-2 px-1"
            style={{ color: "rgba(239,68,68,0.4)" }}
          >
            <span
              className="text-xs font-bold tracking-widest uppercase"
              style={{ fontFamily: "'Rajdhani', sans-serif", fontSize: "10px" }}
            >
              Out
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {eliminatedPlayers.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </>
      )}
    </aside>
  );
}
