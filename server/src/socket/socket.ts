import type { Server as HttpServer } from "node:http";
import { Server } from "socket.io";
import { env } from "../config/env.js";
import { registerSocketHandlers } from "./socket.handler.js";

export let io: Server;

export function initializeSocket(server: HttpServer): Server {
  io = new Server(server, {
    cors: {
      origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN,
    },
  });

  registerSocketHandlers(io);

  return io;
}
