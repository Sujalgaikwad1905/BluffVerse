import { useState, useCallback } from "react";

import type { Rank } from "@/lib/game-types";
import { useGameStore } from "@/store/gameStore";
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

const gamePlayers = useGameStore((state) => state.gamePlayers);
const currentClaim = useGameStore((state) => state.currentClaim);
const discardPile = useGameStore((state) => state.discardPile);
const lastPlayedCards = useGameStore((state) => state.lastPlayedCards);
const roundMessage = useGameStore((state) => state.roundMessage);

const setMyHand = useGameStore((state) => state.setMyHand);
  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set());
  const [selectedRank, setSelectedRank] = useState<Rank | null>(null);
  const [showWinner, setShowWinner] = useState(false);

  const localPlayer = gamePlayers.find((p) => p.isLocalPlayer)!;
  const isMyTurn = localPlayer?.isCurrentTurn ?? false;
const canCallBluff = !!currentClaim && !isMyTurn;

  const handleCardSelect = useCallback(
    (cardId: string) => {
      setSelectedCards((prev) => {
        const next = new Set(prev);
        if (next.has(cardId)) {
          next.delete(cardId);
        } else {
          next.add(cardId);
        }
        return next;
      });
    },
    []
  );

  const handlePlay = useCallback(() => {
    if (!selectedRank || selectedCards.size === 0) return;

    // Update game state with new claim
    const newClaim = {
      rank: selectedRank,
      quantity: selectedCards.size,
      playerUsername: localPlayer.username,
    };

    // Remove played cards from hand
    const newHand = hand.filter((c) => !selectedCards.has(c.id));

    setHand(newHand);
    setGameState((prev) => ({
      ...prev,
      currentClaim: newClaim,
      players: prev.players.map((p) =>
        p.isLocalPlayer
          ? { ...p, cardCount: newHand.length, isCurrentTurn: false }
          : p.id === "p2"
          ? { ...p, isCurrentTurn: true }
          : p
      ),
    }));

    setSelectedCards(new Set());
    setSelectedRank(null);

    // Check for win condition
    if (newHand.length === 0) {
      setTimeout(() => setShowWinner(true), 800);
    }
  }, [selectedRank, selectedCards, hand, localPlayer.username]);

  const handleCallBluff = useCallback(() => {
    // Flash animation + reveal
    setGameState((prev) => ({
      ...prev,
      roundMessage: "BLUFF CALLED! Revealing cards...",
      currentClaim: null,
    }));

    setTimeout(() => {
      setGameState((prev) => ({
        ...prev,
        roundMessage: null,
        players: prev.players.map((p) =>
          p.isLocalPlayer ? { ...p, isCurrentTurn: true } : { ...p, isCurrentTurn: false }
        ),
      }));
    }, 2000);
  }, []);

  const handlePass = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      players: prev.players.map((p) =>
        p.isLocalPlayer
          ? { ...p, isCurrentTurn: false }
          : p.id === "p2"
          ? { ...p, isCurrentTurn: true }
          : p
      ),
    }));
    setSelectedCards(new Set());
    setSelectedRank(null);
  }, []);

  const handleLeave = useCallback(() => {
    if (onLeave) {
      onLeave();
    } else {
      window.location.reload();
    }
  }, [onLeave]);

  const handlePlayAgain = useCallback(() => {
    setGameState(MOCK_GAME_STATE);
    setHand(MOCK_HAND);
    setSelectedCards(new Set());
    setSelectedRank(null);
    setShowWinner(false);
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
            {false && (
        <WinnerModal
          winner={localPlayer}
          isLocalPlayerWinner={true}
          onPlayAgain={handlePlayAgain}
          onLeave={handleLeave}
        />
      )}
    </div>
  );
}