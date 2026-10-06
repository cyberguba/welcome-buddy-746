import { Check, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useT, type Lang } from "@/shared/i18n";

const NAMES: Record<Lang, string> = { et: "Eesti keel", en: "English" };

export function LanguageMenu() {
  const { t, lang, setLang } = useT();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t.header.language}
        className="flex items-center gap-1 rounded-full px-2 py-1.5 text-[0.6875rem] font-semibold uppercase text-muted-foreground outline-none transition hover:bg-muted hover:text-foreground"
      >
        <Globe className="size-4" />
        {lang}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(NAMES) as Lang[]).map((l) => (
          <DropdownMenuItem key={l} onSelect={() => setLang(l)} className="gap-2 text-[0.8125rem]">
            <Check className={lang === l ? "size-4 text-primary" : "size-4 opacity-0"} />
            {NAMES[l]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
