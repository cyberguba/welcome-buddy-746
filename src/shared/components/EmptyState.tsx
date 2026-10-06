import { useT } from "@/shared/i18n";
export function EmptyState({ message }: { message?: string }) {
  const { t } = useT();
  return <p className="text-[0.8125rem] text-muted-foreground">{message ?? t.common.nothing}</p>;
}
