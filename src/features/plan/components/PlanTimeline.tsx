import { useT } from "@/shared/i18n";
import { cn } from "@/lib/utils";
import { groupByWeek } from "@/shared/lib/format";
import type { Assignment } from "@/shared/api/induction-api";
import { PlanItemRow } from "./PlanItemRow";

export function PlanTimeline({ items }: { items: Assignment[] }) {
  const { t, lang } = useT();
  const groups = groupByWeek(items, lang);
  return (
    <div className="space-y-6">
      {groups.map((g) => (
        <div key={g.key} className="animate-rise">
          <div className="mb-2 flex items-center gap-2">
            <span className={cn("size-2 rounded-full", g.tone === "overdue" ? "bg-destructive" : g.tone === "none" ? "bg-muted-foreground" : "bg-primary")} />
            <h2 className={cn("font-display text-[14px] font-bold", g.tone === "overdue" && "text-destructive")}>{g.label}</h2>
            <span className="text-[11px] text-muted-foreground">{t.common.items(g.items.length)}</span>
          </div>
          <div className="glass overflow-hidden rounded-2xl">
            {g.items.map((a) => (
              <PlanItemRow key={a.id} assignment={a} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
