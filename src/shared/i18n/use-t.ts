import { useContext } from "react";
import { LanguageContext } from "./language-context";

export function useT() {
  return useContext(LanguageContext);
}
