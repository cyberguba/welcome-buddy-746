import { useT } from "@/shared/i18n";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ProgressBar } from "@/shared/components/ProgressBar";
import { EmptyState } from "@/shared/components/EmptyState";
import { AssignDialog } from "./AssignDialog";
import { summarize, type Assignment, type Profile } from "@/shared/api/induction-api";
import { initials, isOverdue } from "@/shared/lib/format";

interface ProgressTableProps {
  people: Profile[];
  assignments: Assignment[];
  emptyMessage: string;
}

export function ProgressTable({ people, assignments, emptyMessage }: ProgressTableProps) {
  const { t } = useT();
  const [editing, setEditing] = useState<Profile | null>(null);
  if (people.length === 0) return <EmptyState message={emptyMessage} />;

  return (
    <>
      <div className="glass overflow-hidden rounded-2xl">
        {people.map((person) => {
          const personAssignments = assignments.filter((assignment) => assignment.user_id === person.id);
          const summary = summarize(personAssignments);
          const overdueCount = personAssignments.filter((assignment) => isOverdue(assignment.due_date, assignment.progress)).length;
          return (
            <div key={person.id} className="flex flex-wrap items-center gap-4 border-b border-border px-5 py-4 last:border-0">
              <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-accent text-[12px] font-bold text-accent-foreground">
                {initials(person.full_name || person.email)}
              </div>
              <div className="min-w-[160px] flex-1">
                <div className="text-[13px] font-semibold">{person.full_name || person.email}</div>
                <div className="text-[11px] text-muted-foreground">{person.email}</div>
              </div>
              <div className="w-48">
                <ProgressBar pct={summary.pct} />
                <div className="mt-1 text-[11px] text-muted-foreground">
                  {t.progress.doneOf(summary.done, summary.total)}
                  {overdueCount > 0 && <span className="text-destructive"> · {t.progress.overdue(overdueCount)}</span>}
                </div>
              </div>
              <Link
                to="/plan"
                search={{ user: person.id }}
                className="rounded-lg px-3 py-1.5 text-[12px] font-semibold text-primary ring-1 ring-border transition hover:bg-accent"
              >
                {t.progress.viewPlan}
              </Link>
              <button
                type="button"
                onClick={() => setEditing(person)}
                className="rounded-lg bg-accent px-3 py-1.5 text-[12px] font-semibold text-accent-foreground transition hover:bg-primary/20"
              >
                {t.progress.assign}
              </button>
            </div>
          );
        })}
      </div>
      <AssignDialog employee={editing} onClose={() => setEditing(null)} />
    </>
  );
}
