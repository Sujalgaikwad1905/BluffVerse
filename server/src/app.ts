import cors from "cors";
import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import { env } from "./config/env.js";
import healthRouter from "./routes/health.route.js";
import { logger } from "./shared/logger/logger.js";
import authRoutes from "./auth/auth.route.js";


const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN,
  }),
);
app.use(express.json());

app.use("/health", healthRouter);
app.use("/api/auth", authRoutes);
app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: "Not Found" });
});

app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error("Unhandled error", {
      error: err.message,
      stack: err.stack,
    });
    res.status(500).json({ error: "Internal Server Error" });
  },
);

export default app;
