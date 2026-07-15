import { eventQueue } from "./event.queue.js";
import {
  playCards,
  handleNoBluff,
  resolveBluff,
  passTurn,
} from "./game.manager.js";
import { gameValidator } from "./game.validator.js";
import { Card, Rank } from "./deck.js";
import {
  GameState,
  activeGames,
} from "./game.state.js";
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

                  // Winner confirmed after bluff window
                  if (game.winner) {
                    const winnerPlayer = game.players.find(
                      (player) => player.id === game.winner
                    );
                    
                    io.to(roomCode).emit("game_over", {
                      winnerId: game.winner,
                      winnerUsername: winnerPlayer?.username,
                    });

                    timerManager.clearBluffTimer(roomCode);
                    timerManager.clearTurnTimer(roomCode);
                    eventQueue.clearQueue(roomCode);
                    console.log("NO BLUFF WINNER:", game.winner);

                    return;
                  }

                  io.to(roomCode).emit("turn_changed", {
                    currentTurn: game.players[game.currentTurn].id,

                    currentTurnUsername:
                      game.players[game.currentTurn].username,

                    claimedRank: game.currentClaimedRank,
                  });

                  if (game.currentClaimedRank !== null) {
                    const token = game.turnToken;

                    timerManager.startTurnTimer(
                      roomCode,
                      () => this.autoPass(roomCode, token)
                    );
                  }
                                
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

          console.log("GAME WINNER:", game.winner);

          eventQueue.clearQueue(roomCode);

          if (game.winner) {
            const winnerPlayer = game.players.find(
              (player) => player.id === game.winner
            );
            
            io.to(roomCode).emit("game_over", {
              winnerId: game.winner,
              winnerUsername: winnerPlayer?.username,
            });

            timerManager.clearBluffTimer(roomCode);
            timerManager.clearTurnTimer(roomCode);
            eventQueue.clearQueue(roomCode);
          
            resolve(game);
            return;
          }

          
  
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
  
          if (game.currentClaimedRank !== null) {
            const token = game.turnToken;

            timerManager.startTurnTimer(
              roomCode,
              () => this.autoPass(roomCode, token)
            );
        }
  
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
  
          if (game.currentClaimedRank !== null) {
            const token = game.turnToken;

          timerManager.startTurnTimer(
            roomCode,
            () => this.autoPass(roomCode, token)
          );
        }
  
          resolve(game);
        } catch (error) {
          reject(error);
        }
      });
    });
  }
  private autoPass(
    roomCode: string,
    token: number
  ){

    const game = activeGames.get(roomCode);

    if (!game) {
      return;
    }
    
    if (game.turnToken !== token) {
      console.log("Ignoring stale timer");
      return;
    }
    eventQueue.enqueue(roomCode, async () => {

      console.log("AUTO PASS TIMER FIRED");
  
      const updatedGame = passTurn(roomCode);
  
      io.to(roomCode).emit("turn_changed", {
        currentTurn: updatedGame.players[updatedGame.currentTurn].id,
  
        currentTurnUsername:
          updatedGame.players[updatedGame.currentTurn].username,
  
        claimedRank:
          updatedGame.currentClaimedRank,
      });
  
      // If the pass cycle completed,
      // the round has ended.
      // Don't continue auto-passing.
      if (updatedGame.currentClaimedRank === null) {
        return;
      }
  
      const nextToken = updatedGame.turnToken;

      timerManager.startTurnTimer(
        roomCode,
        () => this.autoPass(roomCode, nextToken)
      );
      
    });
  }

}




export const gameEngine = new GameEngine();