export interface Player {
  id: string;
  username: string;
  ready: boolean;
}

export interface Card {
  rank: string;
  suit: string;
}

export interface EventLog {
  id: number;
  message: string;
}

export interface LastMove {
  playerId: string;
  claimedRank: string;
  cardsPlayed: number;
}

export interface GameState {
  currentTurn?: string;

  currentTurnUsername?: string;

  claimedRank?: string | null;

  phase?: string;

  lastMove?: LastMove;
}