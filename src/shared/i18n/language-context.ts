import { createContext } from "react";
import { DEFAULT_LANG, DICTS, type Dict, type Lang } from "./dictionaries";

export interface LanguageValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: Dict;
}

export const LanguageContext = createContext<LanguageValue>({
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: DICTS[DEFAULT_LANG],
});
