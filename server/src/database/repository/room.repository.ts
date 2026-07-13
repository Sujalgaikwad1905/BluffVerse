import { Prisma, Room } from "@prisma/client";
import { prisma } from "../prisma.js";

export class RoomRepository {
    async create(data: any): Promise<Room> {
    return prisma.room.create({
      data,
    });
  }

  async findByCode(code: string): Promise<Room | null> {
    return prisma.room.findUnique({
      where: {
        code,
      },
    });
  }

  async findById(id: string): Promise<Room | null> {
    return prisma.room.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    id: string,
    data: any
): Promise<Room> {
    return prisma.room.update({
      where: {
        id,
      },
      data,
    });
  }
}

export const roomRepository = new RoomRepository();