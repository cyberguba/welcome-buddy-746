import { useT } from "@/shared/i18n";
import type { Assignment } from "@/shared/api/types";
import { isAssignmentComplete } from "@/shared/lib/assignments";
import { formatDueLabel } from "@/shared/lib/format";
import { useDeleteAssignment, useUpdateAssignmentDueDate } from "../hooks/use-assignment-mutations";

export function CurrentAssignmentRow({ assignment }: { assignment: Assignment }) {
  const { t, lang } = useT();
  const deleteAssignment = useDeleteAssignment();
  const updateDueDate = useUpdateAssignmentDueDate();
  const title = assignment.course?.title ?? assignment.document?.title ?? t.common.untitled;
  const currentDueDate = assignment.due_date ?? "";

  return (
    <div className="flex items-center gap-3 rounded-xl bg-muted px-3 py-2">
      <span className="w-16 text-[0.625rem] font-semibold uppercase text-primary">
        {assignment.course ? t.common.course : t.common.doc}
      </span>
      <span className="flex-1 text-[0.8125rem]">{title}</span>
      <span className="text-[0.6875rem] text-muted-foreground">
        {isAssignmentComplete(assignment) ? t.common.done : `${assignment.progress}%`}
      </span>
      <input
        type="date"
        defaultValue={currentDueDate}
        onBlur={(event) => {
          if (event.target.value !== currentDueDate) {
            updateDueDate.mutate({ assignmentId: assignment.id, dueDate: event.target.value });
          }
        }}
        className="rounded-lg bg-card px-2 py-1 text-[0.6875rem] ring-1 ring-border"
        aria-label={`${t.assign.dueDate}: ${title}`}
        title={formatDueLabel(assignment.due_date, lang)}
      />
      <button
        type="button"
        onClick={() => deleteAssignment.mutate(assignment.id)}
        disabled={deleteAssignment.isPending}
        aria-label={t.assign.removeItem(title)}
        className="text-[0.6875rem] font-semibold text-destructive"
      >
        {t.assign.remove}
      </button>
    </div>
  );
}
