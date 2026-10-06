import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useT } from "@/shared/i18n";
import { EmptyState } from "@/shared/components/EmptyState";
import { userAssignmentsQuery } from "@/shared/api/assignments";
import { profileWithRolesQuery } from "@/shared/api/profiles";
import { isAssignmentComplete } from "@/shared/lib/assignments";
import { useAuth } from "@/features/auth/use-auth";
import { PlanSummaryCard } from "./components/PlanSummaryCard";
import { PlanTimeline } from "./components/PlanTimeline";

interface PlanPageProps {
  /** Set when HR or a manager opens someone else's plan. */
  viewedUserId?: string | undefined;
}

export function PlanPage({ viewedUserId }: PlanPageProps) {
  const { userId } = useAuth();
  const { t } = useT();
  const targetUserId = viewedUserId ?? userId;
  const isOtherPersonsPlan = targetUserId !== userId;
  const [isHidingDone, setIsHidingDone] = useState(false);
  const { data: assignments = [], isLoading } = useQuery(userAssignmentsQuery(targetUserId));
  const { data: viewedPerson } = useQuery({
    ...profileWithRolesQuery(targetUserId),
    enabled: isOtherPersonsPlan,
  });

  const visibleAssignments = isHidingDone
    ? assignments.filter((assignment) => !isAssignmentComplete(assignment))
    : assignments;
  const title = isOtherPersonsPlan
    ? t.plan.of(viewedPerson?.profile?.full_name ?? t.plan.employee)
    : t.plan.mine;

  return (
    <section className="mt-7">
      <PlanSummaryCard title={title} assignments={assignments} />

      <label className="mt-6 mb-4 inline-flex cursor-pointer items-center gap-2 text-[0.75rem] font-medium text-muted-foreground">
        <input
          type="checkbox"
          checked={isHidingDone}
          onChange={(event) => setIsHidingDone(event.target.checked)}
          className="accent-primary"
        />
        {t.plan.hideDone}
      </label>

      <PlanTimeline assignments={visibleAssignments} />
      {!isLoading && visibleAssignments.length === 0 && (
        <EmptyState message={assignments.length ? t.plan.allDone : t.plan.nothing} />
      )}
    </section>
  );
}
