import { useT } from "@/shared/i18n";
import { cn } from "@/lib/utils";
import { courseImage, courseLabel, dueLabel, isOverdue } from "@/shared/lib/format";
import { useUpdateProgress } from "@/features/assignments/use-my-assignments";
import { ProgressBar } from "@/shared/components/ProgressBar";
import type { Assignment } from "@/shared/api/induction-api";

const STEP = 34;

export function CourseCard({ assignment }: { assignment: Assignment }) {
  const course = assignment.course;
  const update = useUpdateProgress();
  const { t, lang } = useT();
  if (!course) return null;
  const pct = assignment.progress;
  const done = pct >= 100;
  const overdue = isOverdue(assignment.due_date, pct);

  return (
    <div className="glass animate-rise overflow-hidden rounded-2xl">
      <img
        src={courseImage(course.image_key)}
        alt={course.title}
        loading="lazy"
        width={992}
        height={672}
        className="aspect-[16/9] w-full object-cover"
      />
      <div className="p-5">
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
            {course.category}
          </div>
          <div
            className={cn(
              "text-[10px] font-medium",
              overdue ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {overdue ? `${t.common.overdue} · ` : ""}
            {dueLabel(assignment.due_date, lang)}
          </div>
        </div>
        <h3 className="mt-1 font-display text-[14px] font-bold">{course.title}</h3>
        {course.description && (
          <p className="mt-1 text-[12px] text-muted-foreground">{course.description}</p>
        )}
        <div className="mt-3">
          <ProgressBar pct={pct} />
        </div>
        <div
          className={cn(
            "mt-2 text-[11px] font-medium",
            done ? "text-success" : "text-muted-foreground",
          )}
        >
          {courseLabel(pct, course.minutes, lang)}
        </div>
        {!done && (
          <button
            type="button"
            disabled={update.isPending}
            onClick={() => update.mutate({ id: assignment.id, progress: pct + STEP })}
            className="mt-4 rounded-lg bg-accent px-3 py-1.5 text-[12px] font-semibold text-accent-foreground transition hover:bg-primary/20 disabled:opacity-60"
          >
            {pct === 0 ? t.course.start : t.course.continue}
          </button>
        )}
      </div>
    </div>
  );
}
