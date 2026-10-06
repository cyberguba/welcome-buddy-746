import { Link } from "@tanstack/react-router";
import { useT } from "@/shared/i18n";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/shared/components/ProgressBar";
import type { Assignment } from "@/shared/api/types";
import { getAssignmentStatus, type AssignmentStatus } from "@/shared/lib/assignments";
import { formatDueLabel } from "@/shared/lib/format";

const STATUS_TEXT_CLASS: Record<AssignmentStatus, string> = {
  done: "text-success",
  overdue: "text-destructive",
  inProgress: "text-muted-foreground",
  notStarted: "text-muted-foreground",
};

export function PlanItemRow({ assignment }: { assignment: Assignment }) {
  const { t, lang } = useT();
  const isDocument = !!assignment.document_id;
  const title = assignment.document?.title ?? assignment.course?.title ?? t.common.untitled;
  const status = getAssignmentStatus(assignment);

  return (
    <Link
      to={isDocument ? "/documents" : "/courses"}
      className="flex flex-wrap items-center gap-4 border-b border-border px-5 py-3.5 transition last:border-0 hover:bg-card"
    >
      <span
        className={cn(
          "w-20 shrink-0 text-[0.625rem] font-semibold uppercase tracking-[0.14em]",
          isDocument ? "text-warning" : "text-primary",
        )}
      >
        {isDocument ? t.common.document : t.common.course}
      </span>
      <span
        className={cn(
          "min-w-[10rem] flex-1 text-[0.8125rem] font-semibold",
          status === "done" && "text-muted-foreground line-through",
        )}
      >
        {title}
      </span>
      <span className="w-24 text-[0.6875rem] text-muted-foreground">
        {formatDueLabel(assignment.due_date, lang)}
      </span>
      <span className="w-28">
        <ProgressBar percent={assignment.progress} label={title} />
      </span>
      <span
        className={cn("w-24 text-right text-[0.6875rem] font-semibold", STATUS_TEXT_CLASS[status])}
      >
        {t.common[status]}
      </span>
    </Link>
  );
}
