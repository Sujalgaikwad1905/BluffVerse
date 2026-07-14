import { createDeck } from "./deck.js";
import { shuffleDeck } from "./shuffle.js";
import { dealCards } from "./dealer.js";
import { Card, Rank } from "./deck.js";
import {
  activeGames,
  GameState,
  PlayerState,
} from "./game.state.js";
import { gameValidator } from "./game.validator.js";

interface StartGamePlayer {
  id: string;
  username: string;
}

export function startGame(
  roomCode: string,
  players: StartGamePlayer[]
): GameState {
  const deck = createDeck();

  const shuffledDeck = shuffleDeck(deck);

  const hands = dealCards(
    shuffledDeck,
    players.map((player) => player.id)
  );

  

  const gamePlayers: PlayerState[] = players.map((player) => ({
    id: player.id,
    username: player.username,
    cards: hands.get(player.id) ?? [],
    ready: false,
  }));

  const gameState: GameState = {
    roomCode,
    players: gamePlayers,
    currentTurn: 0,
    pile: [],
    currentClaimedRank: null,

    lastPlayedCards: [],

    lastPlayerId: null,

    bluffWindowOpen: false,

    passCount: 0,

    roundStarter: 0,
    started: true,
    winner: null,
  };

  activeGames.set(roomCode, gameState);


  

  return gameState;
}

export function playCards(
    roomCode: string,
    playerId: string,
    cards: Card[],
    claimedRank: Rank
  ): GameState {
    const { game, player } =
  gameValidator.validatePlayCards(
    roomCode,
    playerId,
    cards,
    claimedRank
  );
  
    // Remove cards from player's hand
    for (const card of cards) {
      const index = player.cards.findIndex(
        (c) =>
          c.rank === card.rank &&
          c.suit === card.suit
      );
  
      if (index === -1) {
        throw new Error("Invalid card");
      }
  
      player.cards.splice(index, 1);
      
    }
  
    game.pile.push(...cards);
  
    game.lastPlayedCards = [...cards];
  
    game.lastPlayerId = playerId;
  
    game.currentClaimedRank = claimedRank;
  
    game.bluffWindowOpen = true;
    game.passCount = 0;
    if (player.cards.length === 0) {
        game.winner = player.id;
      }
  
    return game;
  }


