import type { Server, Socket } from "socket.io";
import { logger } from "../shared/logger/logger.js";
import { startGame } from "../game/game.manager.js";
import { playCards } from "../game/game.manager.js";
import type { Card, Rank } from "../game/deck.js";
import { eventQueue } from "../game/event.queue.js";
import { gameEngine } from "../game/game.engine.js";
interface PlayerState {
  id: string;
  username: string;
  ready: boolean;
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
interface PlayCardsPayload {
  roomCode: string;
  userId: string;
  cards: Card[];
  claimedRank: Rank;
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

  roomPlayers.get(roomCode)!.set(socketId, {
    id: userId,
    username,
    ready: false,
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
  
      if (players.length < 2) {
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
          currentTurn: game.currentTurn,
        }
      );
  
      logger.info("Game started", {
        roomCode: payload.roomCode,
      });
    }
  );


  socket.on(
    "play_cards",
    async (payload: PlayCardsPayload) => {
      try {
        const game = await gameEngine.handlePlayCards(
          payload.roomCode,
          payload.userId,
          payload.cards,
          payload.claimedRank
        );
  
        io.to(payload.roomCode).emit("cards_played", {
          playerId: payload.userId,
          claimedRank: game.currentClaimedRank,
          cardsPlayed: payload.cards.length,
        });
  
        logger.info("Cards played", {
          roomCode: payload.roomCode,
          playerId: payload.userId,
          cardsPlayed: payload.cards.length,
        });
      } catch (error) {
        logger.error("Failed to play cards", {
          error,
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
