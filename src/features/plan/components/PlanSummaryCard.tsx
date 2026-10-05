import { useT } from "@/shared/i18n";
import { ProgressBar } from "@/shared/components/ProgressBar";
import type { Assignment } from "@/shared/api/types";
import { countOverdueAssignments, summarizeAssignments } from "@/shared/lib/assignments";
import { formatShortDate } from "@/shared/lib/format";

interface PlanSummaryCardProps {
  title: string;
  assignments: Assignment[];
}

function getLastDueDate(assignments: Assignment[]): string | undefined {
  return assignments
    .map((assignment) => assignment.due_date)
    .filter((dueDate): dueDate is string => dueDate !== null)
    .sort()
    .at(-1);
}

export function PlanSummaryCard({ title, assignments }: PlanSummaryCardProps) {
  const { t, lang } = useT();
  const summary = summarizeAssignments(assignments);
  const overdueCount = countOverdueAssignments(assignments);
  const lastDueDate = getLastDueDate(assignments);

  return (
    <div className="glass-strong animate-rise rounded-[28px] p-6">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
        {t.plan.kicker}
      </div>
      <h1 className="mt-1 font-display text-[24px] font-bold">{title}</h1>
      <div className="mt-4 flex flex-wrap items-end gap-6">
        <div className="font-display text-[32px] font-extrabold leading-none text-primary">
          {summary.percentDone}%
        </div>
        <PlanStat label={t.plan.done} value={`${summary.doneCount}/${summary.totalCount}`} />
        <PlanStat
          label={t.plan.overdue}
          value={String(overdueCount)}
          isWarning={overdueCount > 0}
        />
        <PlanStat
          label={t.plan.finishes}
          value={lastDueDate ? formatShortDate(lastDueDate, lang) : "—"}
        />
      </div>
      <div className="mt-3">
        <ProgressBar percent={summary.percentDone} hasGradient />
      </div>
    </div>
  );
}

interface PlanStatProps {
  label: string;
  value: string;
  isWarning?: boolean;
}

function PlanStat({ label, value, isWarning = false }: PlanStatProps) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <div
        className={
          isWarning ? "text-[14px] font-semibold text-destructive" : "text-[14px] font-semibold"
        }
      >
        {value}
      </div>
    </div>
  );
}
