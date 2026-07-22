import type { Card, GameState, Player, Rank, Suit } from "./game-types";

function makeCard(id: string, rank: Rank, suit: Suit, faceUp = false): Card {
  return { id, rank, suit, faceUp };
}

export const MOCK_PLAYERS: Player[] = [
  {
    id: "p1",
    username: "You",
    avatar: "Y",
    cardCount: 7,
    isCurrentTurn: true,
    isEliminated: false,
    isLocalPlayer: true,
    position: "bottom",
  },
  {
    id: "p2",
    username: "ShadowWolf",
    avatar: "S",
    cardCount: 5,
    isCurrentTurn: false,
    isEliminated: false,
    isLocalPlayer: false,
    position: "left",
  },
  {
    id: "p3",
    username: "BlitzKing",
    avatar: "B",
    cardCount: 9,
    isCurrentTurn: false,
    isEliminated: false,
    isLocalPlayer: false,
    position: "top",
  },
  {
    id: "p4",
    username: "NightOwl",
    avatar: "N",
    cardCount: 0,
    isCurrentTurn: false,
    isEliminated: true,
    isLocalPlayer: false,
    position: "right",
  },
];

export const MOCK_HAND: Card[] = [
  makeCard("h1", "A", "spades", true),
  makeCard("h2", "K", "hearts", true),
  makeCard("h3", "K", "diamonds", true),
  makeCard("h4", "7", "clubs", true),
  makeCard("h5", "3", "hearts", true),
  makeCard("h6", "J", "spades", true),
  makeCard("h7", "Q", "clubs", true),
];

export const MOCK_DISCARD: Card[] = [
  makeCard("d1", "A", "spades"),
  makeCard("d2", "A", "hearts"),
  makeCard("d3", "A", "diamonds"),
  makeCard("d4", "K", "clubs"),
  makeCard("d5", "K", "hearts"),
  makeCard("d6", "Q", "diamonds"),
  makeCard("d7", "J", "spades"),
  makeCard("d8", "10", "clubs"),
  makeCard("d9", "9", "hearts"),
  makeCard("d10", "8", "diamonds"),
];

export const MOCK_LAST_PLAYED: Card[] = [
  makeCard("l1", "K", "spades"),
  makeCard("l2", "K", "hearts"),
];

export const MOCK_GAME_STATE: GameState = {
  players: MOCK_PLAYERS,
  discardPile: MOCK_DISCARD,
  currentClaim: {
    rank: "K",
    quantity: 2,
    playerUsername: "ShadowWolf",
  },
  lastPlayedCards: MOCK_LAST_PLAYED,
  phase: "playing",
  winner: null,
  roundMessage: null,
};
