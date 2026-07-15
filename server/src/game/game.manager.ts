import { createDeck } from "./deck.js";
import { shuffleDeck } from "./shuffle.js";
import { dealCards } from "./dealer.js";
import { Card, Rank } from "./deck.js";
import { GamePhase } from "./game.state.js";
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

    phase: GamePhase.PLAYER_DECISION,

    passCount: 0,

    roundStarter: 0,
    started: true,
    winner: null,

    turnToken: 0,
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
  
    game.phase = GamePhase.BLUFF_WINDOW;
    game.passCount = 0;
    game.roundStarter = game.currentTurn;
    
  
    return game;
  }

  export function handleNoBluff(
    roomCode: string
  ): GameState {
    const game = activeGames.get(roomCode);
  
    if (!game) {
      throw new Error("Game not found");
    }
  
    game.phase = GamePhase.PLAYER_DECISION;

// Winner is confirmed only after
// bluff window expires safely.
if (game.lastPlayerId) {
  const lastPlayer = game.players.find(
    (p) => p.id === game.lastPlayerId
  );

  if (lastPlayer && lastPlayer.cards.length === 0) {
    game.winner = lastPlayer.id;
    game.phase = GamePhase.GAME_OVER;
    return game;
  }
}

game.currentTurn =
  (game.currentTurn + 1) %
  game.players.length;

  game.turnToken++;

return game;
  }

  

  export function passTurn(
    roomCode: string
  ): GameState {
    const game = activeGames.get(roomCode);
  
    if (!game) {
      throw new Error("Game not found");
    }
  
    // Count this pass
    game.passCount++;

    console.log("PASS DEBUG", {
      passCount: game.passCount,
      currentTurnBeforeAdvance: game.currentTurn,
      roundStarter: game.roundStarter,
    });
  
    // Move to next player
    game.currentTurn =
      (game.currentTurn + 1) %
      game.players.length;

      game.turnToken++;

      console.log("AFTER ADVANCE", {
        currentTurn: game.currentTurn,
        roundStarter: game.roundStarter,
      });
  
    // Everyone except the last player
    // has passed. Round ends.
    if (
      game.currentTurn === game.roundStarter &&
      game.passCount ===
        game.players.length - 1
    ) {

      console.log("PASS CYCLE COMPLETED");
      game.pile = [];

      game.currentClaimedRank = null;

      game.lastPlayedCards = [];

      game.lastPlayerId = null;

      game.passCount = 0;

      game.phase = GamePhase.PLAYER_DECISION;
    }
  
    return game;
  }


  export function resolveBluff(
    roomCode: string,
    callerId: string
  ): GameState {
    const game = activeGames.get(roomCode);

    
  
    if (!game) {
      throw new Error("Game not found");
    }

    
  
    if (!game.lastPlayerId) {
      throw new Error("No previous move");
    }
  
    const lastPlayer = game.players.find(
      (p) => p.id === game.lastPlayerId
    );
  
    const caller = game.players.find(
      (p) => p.id === callerId
    );
  
    if (!lastPlayer || !caller) {
      throw new Error("Player not found");
    }

    console.log(
      game.lastPlayedCards.map(c => ({
        actual: c.rank,
        claimed: game.currentClaimedRank,
        equal: c.rank === game.currentClaimedRank,
      }))
    ); 
  
    const bluffSuccessful = game.lastPlayedCards.some(
      (card) => card.rank !== game.currentClaimedRank
    );

    console.log({
      bluffSuccessful,
      caller: caller.username,
      lastPlayer: lastPlayer.username,
      claimedRank: game.currentClaimedRank,
      actualCards: game.lastPlayedCards.map(c => c.rank),
    });
  
    // Make a copy BEFORE clearing the pile
    const pile = [...game.pile];
  
    if (bluffSuccessful) {
      // Previous player lied
      lastPlayer.cards.push(...pile);
  
      game.currentTurn = game.players.findIndex(
        (p) => p.id === callerId
      );
      game.turnToken++;
    } else {
      // Caller challenged incorrectly
      caller.cards.push(...pile);
    
      // Previous player starts next round
      game.currentTurn = game.players.findIndex(
        (p) => p.id === game.lastPlayerId
      );
    
      // Previous player survived the bluff.
      // If they have no cards left, they win.
      console.log(
        "CHECK WINNER LENGTH:",
        lastPlayer.cards.length
      );
      
      if (lastPlayer.cards.length === 0) {
        console.log("SETTING WINNER");
      
        game.winner = lastPlayer.id;
        game.phase = GamePhase.GAME_OVER;
      }
      game.turnToken++;
    }

    console.log("LAST PLAYER HAND", lastPlayer.cards.length);

console.log("CALLER HAND", caller.cards.length);  
  
    // Reset round state
    game.pile = [];
    game.lastPlayedCards = [];
    game.lastPlayerId = null;
    game.currentClaimedRank = null;
    
    if (!game.winner) {
      game.phase = GamePhase.PLAYER_DECISION;
    }
    game.passCount = 0;
    game.roundStarter = game.currentTurn;


    console.log("GAME WINNER:", game.winner);
    
  
    return game;
  }


