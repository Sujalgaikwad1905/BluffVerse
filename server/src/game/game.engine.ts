import { eventQueue } from "./event.queue.js";
import { playCards } from "./game.manager.js";
import { Card, Rank } from "./deck.js";
import { GameState } from "./game.state.js";
import { timerManager } from "./timer.manager.js";
import { handleNoBluff } from "./game.manager.js";
import { io } from "../socket/socket.js";

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
              
              timerManager.startBluffTimer(roomCode, () => {
                eventQueue.enqueue(roomCode, async () => {
                    const game = handleNoBluff(roomCode);

                    io.to(roomCode).emit("turn_changed", {
                        currentTurn: game.players[game.currentTurn].id,
                        claimedRank: game.currentClaimedRank,
                      });

                    
                    
                    timerManager.startTurnTimer(roomCode, () => {
                        // Turn timer always belongs
                        // to the current player only.
                        // TODO
                    });
                });
              });
              
              return resolve(game);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
}

export const gameEngine = new GameEngine();