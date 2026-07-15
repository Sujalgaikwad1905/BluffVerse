import type { Server, Socket } from "socket.io";
import { logger } from "../shared/logger/logger.js";
import { startGame } from "../game/game.manager.js";

import type { Card, Rank } from "../game/deck.js";
import { eventQueue } from "../game/event.queue.js";
import { gameEngine } from "../game/game.engine.js";


interface PlayerState {
  id: string;
  username: string;
  ready: boolean;
  isHost: boolean;
}

const roomPlayers = new Map<
  string,
  Map<string, PlayerState>
>();

interface JoinRoomPayload {
  roomCode: string;
  userId: string;
  username: string;
}
interface ReadyPayload {
  roomCode: string;
}
interface StartGamePayload {
  roomCode: string;
}

interface CallBluffPayload {
  roomCode: string;
}


interface PlayCardsPayload {
  roomCode: string;
  
  cards: Card[];
  claimedRank: Rank;
}

interface PassPayload {
  roomCode: string;
}

function getPlayerCount(roomCode: string): number {
  return roomPlayers.get(roomCode)?.size ?? 0;
}



function addPlayer(
  roomCode: string,
  socketId: string,
  userId: string,
  username: string
): void {
  if (!roomPlayers.has(roomCode)) {
    roomPlayers.set(roomCode, new Map());
  }

  const isHost =
  roomPlayers.get(roomCode)!.size === 0;

    roomPlayers.get(roomCode)!.set(socketId, {
      id: userId,
      username,
      ready: false,
      isHost,
    });
}

function removePlayer(
  roomCode: string,
  socketId: string
): void {
  const players = roomPlayers.get(roomCode);

  if (!players) {
    return;
  }

  players.delete(socketId);

  if (players.size === 0) {
    roomPlayers.delete(roomCode);
  }
}

function findRoomBySocketId(socketId: string): string | undefined {
  for (const [roomCode, players] of roomPlayers) {
    if (players.has(socketId)) {
      return roomCode;
    }
  }

  return undefined;
}

function emitPlayerCount(io: Server, roomCode: string): void {
  io.to(roomCode).emit("player_count", {
    roomCode,
    playerCount: getPlayerCount(roomCode),
  });
}

function getPlayers(roomCode: string): PlayerState[] {
  const players = roomPlayers.get(roomCode);

  if (!players) {
    return [];
  }

  return Array.from(players.values());
}

function getPlayerBySocket(
  roomCode: string,
  socketId: string
): PlayerState | undefined {
  return roomPlayers
    .get(roomCode)
    ?.get(socketId);
}

function setReady(
  roomCode: string,
  socketId: string,
  ready: boolean
): void {
  const players = roomPlayers.get(roomCode);

  if (!players) {
    return;
  }

  const player = players.get(socketId);

  if (!player) {
    return;
  }

  player.ready = ready;
}

export function registerSocketHandlers(io: Server): void {
  io.on("connection", (socket: Socket) => {
    logger.info("Socket connected", { socketId: socket.id });

    socket.on("join_room", (payload: JoinRoomPayload) => {
      const { roomCode, userId, username} = payload;

      if (!roomCode || !userId || !username) {
        return;
    }

      socket.join(roomCode);

      const existingRoom = findRoomBySocketId(socket.id);

      if (existingRoom) {
        return;
      }

      socket.join(roomCode);

      addPlayer(
        roomCode,
        socket.id,
        userId,
        username
      );

      io.to(roomCode).emit("player_joined", {
        roomCode,
        username,
      });

      emitPlayerCount(io, roomCode);

      io.to(roomCode).emit("player_list", getPlayers(roomCode));

      logger.info("Player joined room", {
        socketId: socket.id,
        roomCode,
        username,
      });
    }
    
  );

  socket.on("player_ready", (payload: ReadyPayload) => {
    setReady(payload.roomCode, socket.id, true);
  
    io.to(payload.roomCode).emit(
      "player_list",
      getPlayers(payload.roomCode)
    );
  
    logger.info("Player marked ready", {
      socketId: socket.id,
      roomCode: payload.roomCode,
    });
  });

  socket.on(
    "start_game",
    (payload: StartGamePayload) => {
      const players = getPlayers(payload.roomCode);

      const host = players.find(
        (player) => player.isHost
      );
      
      const currentPlayer = getPlayerBySocket(
        payload.roomCode,
        socket.id
      );
      
      if (
        !host ||
        !currentPlayer ||
        host.id !== currentPlayer.id
      ) {
        logger.warn("Non-host tried to start game", {
          roomCode: payload.roomCode,
          userId: currentPlayer?.id,
        });
      
        return;
      }
  
      if (players.length < 2) {
        return;
      }

      const everyoneReady = players.every(
        (player) => player.ready
      );
      
      if (!everyoneReady) {
        logger.warn(
          "Cannot start game. Not everyone is ready.",
          {
            roomCode: payload.roomCode,
          }
        );
      
        return;
      }
  
      const game = startGame(
        payload.roomCode,
        players
      );

      const room = roomPlayers.get(payload.roomCode);

      if (room) {
        for (const [socketId, player] of room.entries()) {
          const playerState = game.players.find(
            (p) => p.id === player.id
          );

          if (!playerState) {
            continue;
          }

          io.to(socketId).emit("your_hand", {
            cards: playerState.cards,
          });
        }
      }
  
      io.to(payload.roomCode).emit(
        "game_started",
        {
          currentTurn:
            game.players[game.currentTurn].id,
      
          currentTurnUsername:
            game.players[game.currentTurn].username,
      
          claimedRank: null,
        }
      );
  
      logger.info("Game started", {
        roomCode: payload.roomCode,
      });
    }
  );


  socket.on(
    "call_bluff",
    async (payload: CallBluffPayload) => {
      try {
        const player = getPlayerBySocket(
          payload.roomCode,
          socket.id
        );
  
        if (!player) {
          return;
        }
  
        const game = await gameEngine.handleCallBluff(
          payload.roomCode,
          player.id
        );

        const room = roomPlayers.get(payload.roomCode);

if (room) {
  for (const [socketId, roomPlayer] of room.entries()) {
    const playerState = game.players.find(
      (p) => p.id === roomPlayer.id
    );

    if (!playerState) {
      continue;
    }

    io.to(socketId).emit("your_hand", {
      cards: playerState.cards,
    });
  }
}

      } catch (error) {
        logger.error("Failed to play cards", {
          roomCode: payload.roomCode,
          socketId: socket.id,
          error:
            error instanceof Error
              ? error.message
              : String(error),
        });
      }
    }
  );



  socket.on(
    "play_cards",
    async (payload: PlayCardsPayload) => {
      try {
        const player = getPlayerBySocket(
          payload.roomCode,
          socket.id
        );
  
        if (!player) {
          return;
        }
  
        const game = await gameEngine.handlePlayCards(
          payload.roomCode,
          player.id,
          payload.cards,
          payload.claimedRank
        );

        const playerState = game.players.find(
          (p) => p.id === player.id
        );
        
        if (playerState) {
          io.to(socket.id).emit("your_hand", {
            cards: playerState.cards,
          });
        }
  
        io.to(payload.roomCode).emit("cards_played", {
          playerId: player.id,
          claimedRank: game.currentClaimedRank,
          cardsPlayed: payload.cards.length,
        });
  
        logger.info("Cards played", {
          roomCode: payload.roomCode,
          playerId: player.id,
          cardsPlayed: payload.cards.length,
        });
  
      } catch (error) {
        logger.error("Failed to play cards", {
          roomCode: payload.roomCode,
          socketId: socket.id,
          error,
        });
      }
    }
  );


  socket.on(
    "pass",
    async (payload: PassPayload) => {
      try {
        const player = getPlayerBySocket(
          payload.roomCode,
          socket.id
        );
  
        if (!player) {
          return;
        }
  
        await gameEngine.handlePass(
          payload.roomCode,
          player.id
        );
  
        logger.info("Player passed", {
          roomCode: payload.roomCode,
          playerId: player.id,
        });
  
      } catch (error) {
        logger.error("Failed to pass", {
          roomCode: payload.roomCode,
          socketId: socket.id,
          error:
            error instanceof Error
              ? error.message
              : String(error),
        });
      }
    }
  );

    socket.on("disconnect", () => {
      const roomCode = findRoomBySocketId(socket.id);

      if (roomCode) {
        removePlayer(roomCode, socket.id);
        emitPlayerCount(io, roomCode);
        io.to(roomCode).emit("player_list", getPlayers(roomCode));

        logger.info("Socket disconnected from room", {
          socketId: socket.id,
          roomCode,
        });
      } else {
        logger.info("Socket disconnected", { socketId: socket.id });
      }
    });
  });
}
