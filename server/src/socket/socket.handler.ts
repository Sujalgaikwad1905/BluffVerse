import type { Server, Socket } from "socket.io";
import { logger } from "../shared/logger/logger.js";

interface PlayerState {
  username: string;
  ready: boolean;
}

const roomPlayers = new Map<
  string,
  Map<string, PlayerState>
>();

interface JoinRoomPayload {
  roomCode: string;
  username: string;
}
interface ReadyPayload {
  roomCode: string;
}

function getPlayerCount(roomCode: string): number {
  return roomPlayers.get(roomCode)?.size ?? 0;
}

function addPlayer(
  roomCode: string,
  socketId: string,
  username: string
): void {
  if (!roomPlayers.has(roomCode)) {
    roomPlayers.set(roomCode, new Map());
  }

  roomPlayers.get(roomCode)!.set(socketId, {
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

function getPlayers(roomCode: string) {
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
      const { roomCode, username } = payload;

      if (!roomCode || !username) {
        return;
      }

      socket.join(roomCode);
      addPlayer(
        roomCode,
        socket.id,
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
