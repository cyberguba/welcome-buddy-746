/**
 * Purpose: one place for app logging, so every log line has the same shape.
 * Constraints: never pass passwords, tokens or file contents in `context`.
 */
type LogContext = Record<string, unknown>;

const LOG_PREFIX = "[induction]";

export const logger = {
  error(message: string, error: unknown, context: LogContext = {}) {
    console.error(`${LOG_PREFIX} ${message}`, { error, ...context });
  },
  warn(message: string, context: LogContext = {}) {
    console.warn(`${LOG_PREFIX} ${message}`, context);
  },
};
