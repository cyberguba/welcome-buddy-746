import { et, type Dict } from "./et";
import { en } from "./en";
import { readStoredValue } from "@/shared/lib/storage";

export type Lang = "et" | "en";
export type { Dict };

export const DEFAULT_LANG: Lang = "et";
export const LANGUAGE_STORAGE_KEY = "postimees-lang";
export const DICTS: Record<Lang, Dict> = { et, en };
export const LOCALES: Record<Lang, string> = { et: "et-EE", en: "en-GB" };

export function isLang(value: string | null): value is Lang {
  return value === "et" || value === "en";
}

/** The language the visitor picked last time, for code that runs outside React (e.g. error toasts). */
export function readStoredLang(): Lang {
  const storedLang = readStoredValue(LANGUAGE_STORAGE_KEY);
  return isLang(storedLang) ? storedLang : DEFAULT_LANG;
}
