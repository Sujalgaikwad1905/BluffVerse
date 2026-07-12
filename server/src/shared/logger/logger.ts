import { env } from "../../config/env.js";

type LogMeta = Record<string, unknown>;

function formatMessage(level: string, message: string, meta?: LogMeta): string {
  const timestamp = new Date().toISOString();
  const metaSuffix = meta ? ` ${JSON.stringify(meta)}` : "";
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaSuffix}`;
}

export const logger = {
  info(message: string, meta?: LogMeta): void {
    console.log(formatMessage("info", message, meta));
  },

  warn(message: string, meta?: LogMeta): void {
    console.warn(formatMessage("warn", message, meta));
  },

  error(message: string, meta?: LogMeta): void {
    console.error(formatMessage("error", message, meta));
  },

  debug(message: string, meta?: LogMeta): void {
    if (env.NODE_ENV === "development") {
      console.debug(formatMessage("debug", message, meta));
    }
  },
};
