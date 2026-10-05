import { logger } from "./logger";

// localStorage can throw (private mode, blocked storage, server render); the app must keep working without it.

export function readStoredValue(key: string): string | null {
  try {
    return typeof window === "undefined" ? null : window.localStorage.getItem(key);
  } catch (error) {
    logger.warn("Could not read browser storage", { key, error });
    return null;
  }
}

export function writeStoredValue(key: string, value: string): void {
  try {
    window.localStorage.setItem(key, value);
  } catch (error) {
    logger.warn("Could not write browser storage", { key, error });
  }
}
