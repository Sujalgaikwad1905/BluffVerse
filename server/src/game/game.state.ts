import { Card, Rank } from "./deck.js";

export interface PlayerState {
  id: string;
  username: string;
  cards: Card[];
  ready: boolean;
}

export interface GameState {
  roomCode: string;

  players: PlayerState[];

  currentTurn: number;

  pile: Card[];

  currentClaimedRank: Rank | null;

  lastPlayedCards: Card[];

  lastPlayerId: string | null;

  bluffWindowOpen: boolean;

  passCount: number;

  roundStarter: number;

  started: boolean;

  winner: string | null;
}

export const activeGames = new Map<
  string,
  GameState
>();