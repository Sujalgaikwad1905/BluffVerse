import { Card, Rank } from "./deck.js";

import {
    activeGames,
    GameState,
    PlayerState,
    GamePhase,
  } from "./game.state.js";

class GameValidator {
  getGame(roomCode: string): GameState {
    const game = activeGames.get(roomCode);

    if (!game) {
      throw new Error("Game not found");
    }

    return game;
  }

  getPlayer(game: GameState, playerId: string): PlayerState {
    const player = game.players.find((p) => p.id === playerId);

    if (!player) {
      throw new Error("Player not found");
    }

    return player;
  }

  validateCallBluff(
    roomCode: string,
    callerId: string
  ): {
    game: GameState;
    caller: PlayerState;
  } {
    const game = this.getGame(roomCode);
  
    if (!game.started) {
      throw new Error("Game has not started");
    }
  
    if (game.phase !== GamePhase.BLUFF_WINDOW) {
      throw new Error("Bluff window is closed");
    }
  
    const caller = this.getPlayer(game, callerId);
  
    if (game.lastPlayerId === callerId) {
      throw new Error(
        "You cannot challenge your own move"
      );
    }
  
    return {
      game,
      caller,
    };
  }

  validatePass(
    roomCode: string,
    playerId: string
  ): {
    game: GameState;
    player: PlayerState;
  } {
    const game = this.getGame(roomCode);

    if (game.currentClaimedRank === null) {
      throw new Error(
          "Cannot pass before a round has started."
      );
  }
  
    if (!game.started) {
      throw new Error("Game has not started");
    }
  
    if (game.phase !== GamePhase.PLAYER_DECISION) {
      throw new Error("You cannot pass right now");
    }
  
    const player = this.getPlayer(game, playerId);
  
    if (game.players[game.currentTurn].id !== playerId) {
      throw new Error("Not your turn");
    }

    
  
    return {
      game,
      player,
    };
  }
    

  validatePlayCards(
    roomCode: string,
    playerId: string,
    cards: Card[],
    claimedRank: Rank
  ): {
    game: GameState;
    player: PlayerState;
  } {
    const game = this.getGame(roomCode);

    if (!game.started) {
      throw new Error("Game has not started");
    }

    if (game.phase !== GamePhase.PLAYER_DECISION) {
        throw new Error("You cannot play cards right now");
    }

    const player = this.getPlayer(game, playerId);

    if (game.players[game.currentTurn].id !== playerId) {
      throw new Error("Not your turn");
    }

    if (cards.length < 1 || cards.length > 4) {
      throw new Error("You must play between 1 and 4 cards");
    }

    for (const card of cards) {
      const ownsCard = player.cards.some(
        (c) =>
          c.rank === card.rank &&
          c.suit === card.suit
      );

      if (!ownsCard) {
        throw new Error("Invalid card");
      }
    }

    if (!claimedRank) {
      throw new Error("Claimed rank is required");
    }
    
    // First move of a round
    if (game.currentClaimedRank === null) {
      return {
        game,
        player,
      };
    }
    
    // During an active round,
    // every player MUST continue
    // with the existing claimed rank.
    if (claimedRank !== game.currentClaimedRank) {
      throw new Error(
        `Current claimed rank is ${game.currentClaimedRank}`
      );
    }
    
    return {
      game,
      player,
    };

    return {
      game,
      player,
    };
  }
}




export const gameValidator = new GameValidator();