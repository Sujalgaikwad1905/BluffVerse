import { Request, Response } from "express";
import { roomService } from "./room.service.js";

class RoomController {
  async createRoom(req: Request, res: Response) {
    try {
      const { hostId } = req.body;

      const room = await roomService.createRoom(hostId);

      return res.status(201).json(room);
    } catch (error) {
      return res.status(400).json({
        message: error instanceof Error ? error.message : "Failed to create room",
      });
    }
  }

  async joinRoom(req: Request, res: Response) {
    try {
      const { code } = req.body;

      const room = await roomService.joinRoom(code);

      return res.status(200).json(room);
    } catch (error) {
      return res.status(404).json({
        message: error instanceof Error ? error.message : "Room not found",
      });
    }
  }

  async getRoom(req: Request, res: Response) {
    try {
        const code = req.params.code as string;
  
      const room = await roomService.getRoom(code);
  
      return res.status(200).json(room);
    } catch (error) {
      return res.status(404).json({
        message: error instanceof Error ? error.message : "Room not found",
      });
    }
  }
}

export const roomController = new RoomController();