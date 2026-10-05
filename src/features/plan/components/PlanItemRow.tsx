import { useT } from "@/shared/i18n";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import { dueLabel, isOverdue } from "@/shared/lib/format";
import { ProgressBar } from "@/shared/components/ProgressBar";
import type { Assignment } from "@/shared/api/induction-api";

export function PlanItemRow({ assignment: a }: { assignment: Assignment }) {
  const { t, lang } = useT();
  const isDoc = !!a.document_id;
  const title = a.document?.title ?? a.course?.title ?? t.common.untitled;
  const done = a.progress >= 100;
  const overdue = isOverdue(a.due_date, a.progress);
  const status = done ? t.common.done : overdue ? t.common.overdue : a.progress > 0 ? t.common.inProgress : t.common.notStarted;
  return (
    <Link
      to={isDoc ? "/documents" : "/courses"}
      className="flex flex-wrap items-center gap-4 border-b border-border px-5 py-3.5 transition last:border-0 hover:bg-card"
    >
      <span className={cn("w-20 shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em]", isDoc ? "text-warning" : "text-primary")}>
        {isDoc ? t.common.document : t.common.course}
      </span>
      <span className={cn("min-w-[160px] flex-1 text-[13px] font-semibold", done && "text-muted-foreground line-through")}>{title}</span>
      <span className="w-24 text-[11px] text-muted-foreground">{dueLabel(a.due_date, lang)}</span>
      <span className="w-28"><ProgressBar pct={a.progress} /></span>
      <span
        className={cn(
          "w-24 text-right text-[11px] font-semibold",
          done ? "text-success" : overdue ? "text-destructive" : "text-muted-foreground",
        )}
      >
        {status}
      </span>
    </Link>
  );
}
