import { useEffect, useState, type ReactNode } from "react";
import {
  DEFAULT_LANG,
  DICTS,
  LANGUAGE_STORAGE_KEY,
  readStoredLang,
  type Lang,
} from "./dictionaries";
import { LanguageContext } from "./language-context";
import { writeStoredValue } from "@/shared/lib/storage";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  // Read storage after mount so the server-rendered shell and first client render match.
  useEffect(() => {
    setLangState(readStoredLang());
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (nextLang: Lang) => {
    writeStoredValue(LANGUAGE_STORAGE_KEY, nextLang);
    setLangState(nextLang);
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: DICTS[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}
