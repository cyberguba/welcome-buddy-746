import { useT } from "@/shared/i18n";
import { cn } from "@/lib/utils";
import type { Assignment } from "@/shared/api/types";
import { groupAssignmentsByWeek, type PlanGroupTone } from "../group-assignments-by-week";
import { PlanItemRow } from "./PlanItemRow";

const TONE_DOT_CLASS: Record<PlanGroupTone, string> = {
  overdue: "bg-destructive",
  none: "bg-muted-foreground",
  week: "bg-primary",
};

export function PlanTimeline({ assignments }: { assignments: Assignment[] }) {
  const { t, lang } = useT();
  const groups = groupAssignmentsByWeek(assignments, lang);
  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <div key={group.key} className="animate-rise">
          <div className="mb-2 flex items-center gap-2">
            <span aria-hidden className={cn("size-2 rounded-full", TONE_DOT_CLASS[group.tone])} />
            <h2
              className={cn(
                "font-display text-[0.875rem] font-bold",
                group.tone === "overdue" && "text-destructive",
              )}
            >
              {group.label}
            </h2>
            <span className="text-[0.6875rem] text-muted-foreground">
              {t.common.items(group.items.length)}
            </span>
          </div>
          <div className="glass overflow-hidden rounded-2xl">
            {group.items.map((assignment) => (
              <PlanItemRow key={assignment.id} assignment={assignment} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
