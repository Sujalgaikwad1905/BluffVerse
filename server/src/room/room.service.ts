import { roomRepository, userRepository } from "../database/index.js";

function generateRoomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

class RoomService {
  async createRoom(hostId: string) {
    const host = await userRepository.findById(hostId);

    if (!host) {
      throw new Error("Host not found");
    }

    const room = await roomRepository.create({
      code: generateRoomCode(),
      host: {
        connect: {
          id: hostId,
        },
      },
    });

    return room;
  }

  async joinRoom(code: string) {
    const room = await roomRepository.findByCode(code);

    if (!room) {
      throw new Error("Room not found");
    }

    return room;
  }
}

export const roomService = new RoomService();