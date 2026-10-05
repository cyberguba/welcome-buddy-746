import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { et, type Dict } from "./et";
import { en } from "./en";

export type Lang = "et" | "en";
export const DICTS: Record<Lang, Dict> = { et, en };
export const LOCALES: Record<Lang, string> = { et: "et-EE", en: "en-GB" };
const STORAGE_KEY = "postimees-lang";

interface LangValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
}

const LangContext = createContext<LangValue>({ lang: "et", setLang: () => {}, t: et });

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("et");

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "et") setLangState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    window.localStorage.setItem(STORAGE_KEY, l);
    setLangState(l);
  };

  return <LangContext.Provider value={{ lang, setLang, t: DICTS[lang] }}>{children}</LangContext.Provider>;
}

export function useT() {
  return useContext(LangContext);
}
