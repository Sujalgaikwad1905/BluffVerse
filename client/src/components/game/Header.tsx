import { Settings, LogOut, Wifi, Copy } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  roomCode: string;
  onLeave?: () => void;
  onSettings?: () => void;
}

export function Header({ roomCode, onLeave, onSettings }: HeaderProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomCode).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <header
      className="flex items-center justify-between px-4 shrink-0"
      style={{
        height: "56px",
        background: "linear-gradient(180deg, #0a0e1a 0%, #0d1120 100%)",
        borderBottom: "1px solid rgba(212,175,55,0.18)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div
          className="flex items-center justify-center rounded-lg font-black text-sm tracking-widest"
          style={{
            width: "36px",
            height: "36px",
            background: "linear-gradient(135deg, #d4af37 0%, #f0d060 100%)",
            color: "#0a0e1a",
            fontFamily: "'Rajdhani', sans-serif",
          }}
        >
          BV
        </div>
        <span
          className="font-black tracking-wider text-lg hidden sm:block"
          style={{
            color: "#d4af37",
            fontFamily: "'Rajdhani', sans-serif",
            letterSpacing: "0.12em",
          }}
        >
          BLUFF<span style={{ color: "#fff" }}>VERSE</span>
        </span>
      </div>

      {/* Room Code + Connection */}
      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full cursor-pointer group"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
          onClick={handleCopy}
          title="Click to copy room code"
        >
          <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>
            ROOM
          </span>
          <span
            className="text-sm font-black tracking-widest"
            style={{ color: "#d4af37", fontFamily: "'Rajdhani', sans-serif" }}
          >
            {roomCode}
          </span>
          <Copy
            size={12}
            className="transition-opacity"
            style={{ color: copied ? "#22c55e" : "rgba(255,255,255,0.35)" }}
          />
          {copied && (
            <span className="text-xs" style={{ color: "#22c55e" }}>
              Copied!
            </span>
          )}
        </div>

        {/* Connection dot */}
        <div className="flex items-center gap-1.5">
          <Wifi size={14} style={{ color: "#22c55e" }} />
          <span className="text-xs font-medium hidden sm:block" style={{ color: "#22c55e" }}>
            Connected
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSettings}
          className="flex items-center justify-center rounded-lg transition-all"
          style={{
            width: "36px",
            height: "36px",
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.6)",
          }}
          aria-label="Settings"
        >
          <Settings size={16} />
        </button>

        <button
          onClick={onLeave}
          className="flex items-center gap-1.5 px-3 rounded-lg text-sm font-semibold transition-all"
          style={{
            height: "36px",
            background: "rgba(239,68,68,0.12)",
            border: "1px solid rgba(239,68,68,0.3)",
            color: "#ef4444",
          }}
          aria-label="Leave game"
        >
          <LogOut size={14} />
          <span className="hidden sm:block">Leave</span>
        </button>
      </div>
    </header>
  );
}
