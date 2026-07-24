import { useState, useCallback, useEffect } from "react";

import type { Player, Rank } from "@/lib/game-types";
import { useGameStore } from "@/store/gameStore";
import { socket } from "@/socket/socket";
import { Header } from "./Header";
import { PlayerSidebar } from "./PlayerSidebar";
import { GameTable } from "./GameTable";
import { PlayerHand } from "./PlayerHand";
import { ActionBar } from "./ActionBar";
import { WinnerModal } from "./WinnerModal";

interface GameScreenProps {
  onLeave?: () => void;
}

export function GameScreen({ onLeave }: GameScreenProps) {
  const hand = useGameStore((state) => state.myHand);
  const roomCode = useGameStore((state) => state.roomCode);
  const userId = useGameStore((state) => state.userId);
  const lobbyPlayers = useGameStore((state) => state.players);
  const gamePlayers = useGameStore((state) => state.gamePlayers);
  const currentClaim = useGameStore((state) => state.currentClaim);
  const discardPile = useGameStore((state) => state.discardPile);
  const lastPlayedCards = useGameStore((state) => state.lastPlayedCards);
  const roundMessage = useGameStore((state) => state.roundMessage);
  const currentTurn = useGameStore((state) => state.currentTurn);
  const claimedRank = useGameStore((state) => state.claimedRank);

  const setCurrentClaim = useGameStore((state) => state.setCurrentClaim);
  const setDiscardPile = useGameStore((state) => state.setDiscardPile);
  const setLastPlayedCards = useGameStore((state) => state.setLastPlayedCards);
  const setRoundMessage = useGameStore((state) => state.setRoundMessage);
  const setGamePlayers = useGameStore((state) => state.setGamePlayers);
  const setCurrentTurn = useGameStore((state) => state.setCurrentTurn);
  const setClaimedRank = useGameStore((state) => state.setClaimedRank);

  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [selectedRank, setSelectedRank] = useState<Rank | null>(null);
  const [showWinner, setShowWinner] = useState(false);
  const [winnerId, setWinnerId] = useState<string | null>(null);
  const [isBluffWindowActive, setIsBluffWindowActive] = useState(false);
  const [lastPlayedPlayerId, setLastPlayedPlayerId] = useState<string | null>(null);

  useEffect(() => {
    const derivedPlayers: Player[] = lobbyPlayers.map((player, index) => ({
      id: player.id,
      username: player.username,
      avatar: player.avatar,
      cardCount: player.id === userId ? hand.length : 0,
      isCurrentTurn: currentTurn === player.id,
      isEliminated: false,
      isLocalPlayer: player.id === userId,
      position: index === 0 ? "bottom" : index === 1 ? "right" : index === 2 ? "left" : "top",
    }));

    setGamePlayers(derivedPlayers);
  }, [lobbyPlayers, currentTurn, hand.length, userId, setGamePlayers]);

  useEffect(() => {
    if (!isBluffWindowActive) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setIsBluffWindowActive(false);
    }, 3000);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [isBluffWindowActive]);

  useEffect(() => {
    const handleCardsPlayed = ({ playerId, claimedRank: nextClaimedRank, cardsPlayed }: any) => {
      const player = lobbyPlayers.find((entry) => entry.id === playerId);
      setCurrentClaim({
        rank: nextClaimedRank,
        quantity: cardsPlayed,
        playerUsername: player?.username ?? "Unknown",
      });

      setClaimedRank(nextClaimedRank);
      setDiscardPile([]);
      setLastPlayedCards([]);
      setRoundMessage(null);
      setLastPlayedPlayerId(playerId);
      setIsBluffWindowActive(true);
    };

    const handleTurnChanged = ({ currentTurn: nextTurn, claimedRank: nextClaimedRank }: any) => {
      setCurrentTurn(nextTurn);
      setClaimedRank(nextClaimedRank);
      setIsBluffWindowActive(false);
      setLastPlayedPlayerId(null);
      if (nextClaimedRank === null) {
        setCurrentClaim(null);
      }
      setRoundMessage(null);
    };

    const handleBluffResolved = () => {
      setRoundMessage("Bluff resolved");
      setCurrentClaim(null);
      setIsBluffWindowActive(false);
      setLastPlayedPlayerId(null);
    };

    const handleGameOver = ({ winnerUsername }: { winnerUsername?: string }) => {
      setShowWinner(true);
      setWinnerId(winnerUsername ?? null);
      setRoundMessage(winnerUsername ? `${winnerUsername} wins!` : "Game over");
      setCurrentClaim(null);
      setIsBluffWindowActive(false);
      setLastPlayedPlayerId(null);
    };

    socket.on("cards_played", handleCardsPlayed);
    socket.on("turn_changed", handleTurnChanged);
    socket.on("bluff_resolved", handleBluffResolved);
    socket.on("game_over", handleGameOver);

    return () => {
      socket.off("cards_played", handleCardsPlayed);
      socket.off("turn_changed", handleTurnChanged);
      socket.off("bluff_resolved", handleBluffResolved);
      socket.off("game_over", handleGameOver);
    };
  }, [lobbyPlayers, setCurrentClaim, setCurrentTurn, setClaimedRank, setDiscardPile, setLastPlayedCards, setRoundMessage]);

  const localPlayer = gamePlayers.find((p) => p.isLocalPlayer);
  const actualWinner = gamePlayers.find((player) => player.username === winnerId || player.id === winnerId) ?? null;
  const isMyTurn = (localPlayer?.isCurrentTurn ?? false) && !isBluffWindowActive;

  console.log("========== BLUFF DEBUG ==========");
console.log({
  userId,
  lastPlayedPlayerId,
  isBluffWindowActive,
  currentClaim,
  claimedRank,
});

console.log(
  "isBluffWindowActive:",
  isBluffWindowActive,
  "currentClaim:",
  !!currentClaim,
  "claimedRank:",
  claimedRank !== null,
  "differentPlayer:",
  userId !== lastPlayedPlayerId
);
  const canCallBluff = isBluffWindowActive && !!currentClaim &&  userId !== lastPlayedPlayerId;

  const handleCardSelect = useCallback(
    (cardId: string) => {
      setSelectedCards((prev) => {
        const next = new Set(prev);
        if (next.has(cardId)) {
          next.delete(cardId);
          return next;
        }
        if (next.size >= 4) {
          return prev;
        }
        next.add(cardId);
        return next;
      });
    },
    []
  );

  const handlePlay = useCallback(() => {
    if (!selectedRank || selectedCards.size === 0 || !roomCode) return;

    const selectedCardsArray = hand.filter((card) => {
      const selectionKey = card.id || `${card.rank}-${card.suit}`;
      return selectedCards.has(selectionKey);
    });

    socket.emit("play_cards", {
      roomCode,
      cards: selectedCardsArray,
      claimedRank: selectedRank,
    });

    setSelectedCards(new Set());
    setSelectedRank(null);
  }, [selectedRank, selectedCards, hand, roomCode]);

  const handleCallBluff = useCallback(() => {
    if (!roomCode) return;

    socket.emit("call_bluff", { roomCode });
    setSelectedCards(new Set());
    setSelectedRank(null);
  }, [roomCode]);

  const handlePass = useCallback(() => {
    if (!roomCode) return;

    socket.emit("pass", { roomCode });
    setSelectedCards(new Set());
    setSelectedRank(null);
  }, [roomCode]);

  const handleLeave = useCallback(() => {
    if (onLeave) {
      onLeave();
    } else {
      window.location.reload();
    }
  }, [onLeave]);

  const handlePlayAgain = useCallback(() => {
    setSelectedCards(new Set());
    setSelectedRank(null);
    setShowWinner(false);
    setWinnerId(null);
  }, []);

  return (
    <div className="game-layout">
      {/* Header */}
      <Header
        roomCode="BV-7X4K"
        onLeave={handleLeave}
      />

      {/* Main content area */}
      <div className="flex flex-1 min-h-0">
        {/* Player Sidebar */}
        <PlayerSidebar players={gamePlayers} />

        {/* Game Table */}
        <GameTable
          discardPile={discardPile}
          currentClaim={currentClaim}
          lastPlayedCards={lastPlayedCards}
          players={gamePlayers}
        />
      </div>

{/* Player Hand */}

      {/* Player Hand */}
      <PlayerHand
        cards={hand}
        selectedCards={selectedCards}
        onCardSelect={handleCardSelect}
        isMyTurn={isMyTurn}
      />

      {/* Action Bar */}
      <ActionBar
        selectedRank={selectedRank}
        selectedCardCount={selectedCards.size}
        onRankSelect={setSelectedRank}
        onPlay={handlePlay}
        onCallBluff={handleCallBluff}
        onPass={handlePass}
        isMyTurn={isMyTurn}
        currentClaim={currentClaim}
        canCallBluff={canCallBluff}
      />

      {/* Round message toast */}
      {roundMessage && (
        <div
          className="fixed top-20 left-1/2 -translate-x-1/2 z-40 px-6 py-3 rounded-2xl animate-slide-in-up"
          style={{
            background: "rgba(239,68,68,0.9)",
            border: "1px solid rgba(239,68,68,0.5)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 8px 32px rgba(239,68,68,0.5)",
            color: "#fff",
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 800,
            fontSize: "16px",
            letterSpacing: "0.08em",
          }}
        >
          {roundMessage}
        </div>
      )}

            {/* Winner Modal */}
            {showWinner && actualWinner && (
        <WinnerModal
          winner={actualWinner}
          isLocalPlayerWinner={actualWinner.id === userId}
          onPlayAgain={handlePlayAgain}
          onLeave={handleLeave}
        />
      )}
    </div>
  );
}