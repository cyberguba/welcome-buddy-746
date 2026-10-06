import { Link } from "@tanstack/react-router";
import { useT } from "@/shared/i18n";
import { ProgressBar } from "@/shared/components/ProgressBar";
import type { Assignment, Profile } from "@/shared/api/types";
import { countOverdueAssignments, summarizeAssignments } from "@/shared/lib/assignments";
import { getDisplayName, getInitials } from "@/shared/lib/format";

interface ProgressTableRowProps {
  person: Profile;
  assignments: Assignment[];
  onAssign: () => void;
}

export function ProgressTableRow({ person, assignments, onAssign }: ProgressTableRowProps) {
  const { t } = useT();
  const summary = summarizeAssignments(assignments);
  const overdueCount = countOverdueAssignments(assignments);
  const displayName = getDisplayName(person);

  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-border px-5 py-4 last:border-0">
      <div
        aria-hidden
        className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-[0.75rem] font-bold text-accent-foreground"
      >
        {getInitials(displayName)}
      </div>
      <div className="min-w-[10rem] flex-1">
        <div className="text-[0.8125rem] font-semibold">{displayName}</div>
        <div className="text-[0.6875rem] text-muted-foreground">{person.email}</div>
      </div>
      <div className="w-48">
        <ProgressBar percent={summary.percentDone} label={displayName} />
        <div className="mt-1 text-[0.6875rem] text-muted-foreground">
          {t.progress.doneOf(summary.doneCount, summary.totalCount)}
          {overdueCount > 0 && (
            <span className="text-destructive"> · {t.progress.overdue(overdueCount)}</span>
          )}
        </div>
      </div>
      <Link
        to="/plan"
        search={{ user: person.id }}
        className="rounded-lg px-3 py-1.5 text-[0.75rem] font-semibold text-primary ring-1 ring-border transition hover:bg-accent"
      >
        {t.progress.viewPlan}
      </Link>
      <button
        type="button"
        onClick={onAssign}
        className="rounded-lg bg-accent px-3 py-1.5 text-[0.75rem] font-semibold text-accent-foreground transition hover:bg-primary/20"
      >
        {t.progress.assign}
      </button>
    </div>
  );
}
