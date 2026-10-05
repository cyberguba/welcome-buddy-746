import { useT } from "@/shared/i18n";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/shared/components/ProgressBar";
import type { Assignment } from "@/shared/api/types";
import { isAssignmentComplete, isAssignmentOverdue } from "@/shared/lib/assignments";
import { getCourseImage } from "@/shared/lib/course-images";
import { formatCourseProgress, formatDueLabel } from "@/shared/lib/format";
import { useUpdateProgress } from "@/features/assignments/use-my-assignments";

// Demo stand-in for a real course player: each click moves progress one third of the way.
const COURSE_PROGRESS_STEP = 34;

export function CourseCard({ assignment }: { assignment: Assignment }) {
  const updateProgress = useUpdateProgress();
  const { t, lang } = useT();
  const course = assignment.course;
  if (!course) return null;

  const progress = assignment.progress;
  const isDone = isAssignmentComplete(assignment);
  const isOverdue = isAssignmentOverdue(assignment);

  return (
    <div className="glass animate-rise overflow-hidden rounded-2xl">
      <img
        src={getCourseImage(course.image_key)}
        alt=""
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
              isOverdue ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {isOverdue ? `${t.common.overdue} · ` : ""}
            {formatDueLabel(assignment.due_date, lang)}
          </div>
        </div>
        <h3 className="mt-1 font-display text-[14px] font-bold">{course.title}</h3>
        {course.description && (
          <p className="mt-1 text-[12px] text-muted-foreground">{course.description}</p>
        )}
        <div className="mt-3">
          <ProgressBar percent={progress} label={course.title} />
        </div>
        <div
          className={cn(
            "mt-2 text-[11px] font-medium",
            isDone ? "text-success" : "text-muted-foreground",
          )}
        >
          {formatCourseProgress(progress, course.minutes, lang)}
        </div>
        {!isDone && (
          <button
            type="button"
            disabled={updateProgress.isPending}
            onClick={() =>
              updateProgress.mutate({
                assignmentId: assignment.id,
                progress: progress + COURSE_PROGRESS_STEP,
              })
            }
            className="mt-4 rounded-lg bg-accent px-3 py-1.5 text-[12px] font-semibold text-accent-foreground transition hover:bg-primary/20 disabled:opacity-60"
          >
            {progress === 0 ? t.course.start : t.course.continue}
          </button>
        )}
      </div>
    </div>
  );
}
