import { eventQueue } from "./event.queue.js";
import { playCards } from "./game.manager.js";
import { Card, Rank } from "./deck.js";
import { GameState } from "./game.state.js";

class GameEngine {
  async handlePlayCards(
    roomCode: string,
    playerId: string,
    cards: Card[],
    claimedRank: Rank
  ): Promise<GameState> {
    return new Promise((resolve, reject) => {
      eventQueue.enqueue(roomCode, async () => {
        try {
          const game = playCards(
            roomCode,
            playerId,
            cards,
            claimedRank
          );

          resolve(game);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}

export const gameEngine = new GameEngine();