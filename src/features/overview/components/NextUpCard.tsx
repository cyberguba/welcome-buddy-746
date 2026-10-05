import { Link } from "@tanstack/react-router";
import { useT } from "@/shared/i18n";
import type { Assignment } from "@/shared/api/types";
import { formatCourseProgress, formatDueLabel } from "@/shared/lib/format";

interface NextUpCardProps {
  nextDocument: Assignment | undefined;
  nextCourse: Assignment | undefined;
  hasAssignments: boolean;
}

export function NextUpCard({ nextDocument, nextCourse, hasAssignments }: NextUpCardProps) {
  const { t, lang } = useT();
  const isAllDone = hasAssignments && !nextDocument && !nextCourse;

  return (
    <div className="glass-strong animate-rise rounded-[28px] p-6 [animation-delay:80ms]">
      <h2 className="font-display text-[15px] font-bold">{t.overview.nextUp}</h2>
      <div className="mt-4 space-y-3">
        {nextDocument?.document && (
          <Link
            to="/documents"
            className="block rounded-2xl bg-card/70 p-4 ring-1 ring-border transition hover:ring-primary/30"
          >
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-warning">
              {t.common.document} · {formatDueLabel(nextDocument.due_date, lang)}
            </div>
            <div className="mt-1 text-[13px] font-semibold">{nextDocument.document.title}</div>
          </Link>
        )}
        {nextCourse?.course && (
          <Link to="/courses" className="block rounded-2xl bg-accent p-4 ring-1 ring-primary/25">
            <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
              {t.common.course} · {formatDueLabel(nextCourse.due_date, lang)}
            </div>
            <div className="mt-1 text-[13px] font-semibold">{nextCourse.course.title}</div>
            <div className="mt-1 text-[11px] font-medium text-muted-foreground">
              {formatCourseProgress(nextCourse.progress, nextCourse.course.minutes, lang)}
            </div>
          </Link>
        )}
        {!hasAssignments && (
          <div className="rounded-2xl bg-muted p-4 text-[13px] text-muted-foreground">
            {t.overview.nothing}
          </div>
        )}
        {isAllDone && (
          <div className="rounded-2xl bg-success/15 p-4 text-[13px] font-semibold text-success">
            {t.overview.allDone}
          </div>
        )}
      </div>
    </div>
  );
}
