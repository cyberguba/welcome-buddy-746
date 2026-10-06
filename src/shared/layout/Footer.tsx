import { useT } from "@/shared/i18n";
export function Footer() {
  const { t } = useT();
  return (
    <footer className="glass mt-8 rounded-2xl px-6 py-4 text-[0.75rem] font-medium text-muted-foreground">
      {t.footer}
    </footer>
  );
}
