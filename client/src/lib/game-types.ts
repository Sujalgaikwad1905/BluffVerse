export type Suit = "spades" | "hearts" | "diamonds" | "clubs";
export type Rank =
  | "A"
  | "K"
  | "Q"
  | "J"
  | "10"
  | "9"
  | "8"
  | "7"
  | "6"
  | "5"
  | "4"
  | "3"
  | "2";

export interface Card {
  id: string;
  rank: Rank;
  suit: Suit;
  faceUp: boolean;
}

export interface Player {
  id: string;
  username: string;
  avatar: string;
  cardCount: number;
  isCurrentTurn: boolean;
  isEliminated: boolean;
  isLocalPlayer: boolean;
  position: "top" | "left" | "right" | "bottom";
}

export interface Claim {
  rank: Rank;
  quantity: number;
  playerUsername: string;
}

export interface GameState {
  players: Player[];
  discardPile: Card[];
  currentClaim: Claim | null;
  lastPlayedCards: Card[];
  phase: "playing" | "bluff-called" | "round-end" | "game-over";
  winner: Player | null;
  roundMessage: string | null;
}

export interface LobbyPlayer {
  id: string;
  username: string;
  avatar: string;
  isHost: boolean;
  isReady: boolean;
  isConnected: boolean;
  isLocalPlayer: boolean;
}

export interface LobbyPlayer {
  id: string;
  username: string;
  avatar: string;

  isHost: boolean;
  isReady: boolean;
  isConnected: boolean;

  isLocalPlayer: boolean;
}

export const RANKS: Rank[] = [
  "A",
  "K",
  "Q",
  "J",
  "10",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
];
