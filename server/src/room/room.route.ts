import { Router } from "express";
import { roomController } from "./room.controller.js";

const router = Router();

router.post("/create", (req, res) => roomController.createRoom(req, res));

router.post("/join", (req, res) => roomController.joinRoom(req, res));

export default router;
