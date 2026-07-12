import app from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./shared/logger/logger.js";

const server = app.listen(env.PORT, () => {
  logger.info("Server started", {
    port: env.PORT,
    nodeEnv: env.NODE_ENV,
  });
});

function shutdown(signal: string): void {
  logger.info("Shutdown signal received", { signal });

  server.close((err) => {
    if (err) {
      logger.error("Error during server shutdown", { error: err.message });
      process.exit(1);
    }

    logger.info("Server stopped");
    process.exit(0);
  });
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
