import { eventQueue } from "./event.queue.js";
import {
  playCards,
  handleNoBluff,
  resolveBluff,
  passTurn,
} from "./game.manager.js";
import { gameValidator } from "./game.validator.js";
import { Card, Rank } from "./deck.js";
import { GameState } from "./game.state.js";
import { timerManager } from "./timer.manager.js";

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
                      currentTurn:
                        game.players[game.currentTurn].id,
                    
                      currentTurnUsername:
                        game.players[game.currentTurn].username,
                    
                      claimedRank:
                        game.currentClaimedRank,
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

  async handleCallBluff(
    roomCode: string,
    callerId: string
  ): Promise<GameState> {
    return new Promise((resolve, reject) => {
      eventQueue.enqueue(roomCode, async () => {
        try {
          gameValidator.validateCallBluff(
            roomCode,
            callerId
          );
  
          timerManager.clearBluffTimer(roomCode);
  
          const game = resolveBluff(
            roomCode,
            callerId
          );

          eventQueue.clearQueue(roomCode);
  
          io.to(roomCode).emit("bluff_resolved", {
            winner: game.players[game.currentTurn].id,
          });
  
          io.to(roomCode).emit("turn_changed", {
            currentTurn:
              game.players[game.currentTurn].id,
          
            currentTurnUsername:
              game.players[game.currentTurn].username,
          
            claimedRank:
              game.currentClaimedRank,
          });
  
          timerManager.startTurnTimer(
            roomCode,
            () => {
              // TODO
              // Auto PASS
            }
          );
  
          resolve(game);
        } catch (error) {
          reject(error);
        }
      });
    });
  }


  async handlePass(
    roomCode: string,
    playerId: string
  ): Promise<GameState> {
    return new Promise((resolve, reject) => {
      eventQueue.enqueue(roomCode, async () => {
        try {
          gameValidator.validatePass(
            roomCode,
            playerId
          );
  
          const game = passTurn(roomCode);

          
  
          io.to(roomCode).emit("turn_changed", {
            currentTurn:
              game.players[game.currentTurn].id,
  
            currentTurnUsername:
              game.players[game.currentTurn].username,
  
            claimedRank:
              game.currentClaimedRank,
          });
  
          timerManager.startTurnTimer(
            roomCode,
            () => {
              // TODO:
              // Auto PASS
            }
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