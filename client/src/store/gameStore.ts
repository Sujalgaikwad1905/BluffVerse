import { create } from "zustand";
import type {
    Card,
    Rank,
    LobbyPlayer,
    Claim,
    Player,
  } from "@/lib/game-types";

interface GameStore {
  roomCode: string;
  username: string;
  userId: string;

  playerCount: number;
  players: LobbyPlayer[];

  myHand: Card[];

  currentTurn: string | null;
  claimedRank: Rank | null;
  currentClaim: Claim | null;
    discardPile: Card[];
    lastPlayedCards: Card[];
    roundMessage: string | null;
    gamePlayers: Player[];


    setCurrentClaim: (claim: Claim | null) => void;
    setDiscardPile: (cards: Card[]) => void;
    setLastPlayedCards: (cards: Card[]) => void;
    setRoundMessage: (message: string | null) => void;
    setGamePlayers: (players: Player[]) => void;  
  setRoomCode: (room: string) => void;
  setUsername: (username: string) => void;
  setUserId: (userId: string) => void;

  setPlayerCount: (count: number) => void;
  setPlayers: (players: LobbyPlayer[]) => void;
  setMyHand: (cards: Card[]) => void;
  setCurrentTurn: (id: string | null) => void;
  setClaimedRank: (rank: Rank | null) => void;

  
}

export const useGameStore = create<GameStore>((set) => ({
  roomCode: "",
  username: "",
  userId: "",

  playerCount: 0,
  players: [],

  myHand: [],

  currentTurn: null,
  claimedRank: null,
  currentClaim: null,
discardPile: [],
lastPlayedCards: [],
roundMessage: null,
gamePlayers: [],
  

  setRoomCode: (roomCode) => set({ roomCode }),
  setUsername: (username) => set({ username }),
  setUserId: (userId) => set({ userId }),

  setPlayerCount: (playerCount) => set({ playerCount }),
  setPlayers: (players) => set({ players }),
  setMyHand: (myHand) => set({ myHand }),
  setCurrentTurn: (currentTurn) => set({ currentTurn }),
  setClaimedRank: (claimedRank) => set({ claimedRank }),
  setCurrentClaim: (currentClaim) => set({ currentClaim }),
setDiscardPile: (discardPile) => set({ discardPile }),
setLastPlayedCards: (lastPlayedCards) => set({ lastPlayedCards }),
setRoundMessage: (roundMessage) => set({ roundMessage }),
setGamePlayers: (gamePlayers) => set({ gamePlayers }),
}));

