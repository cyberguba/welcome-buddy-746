import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateAssignmentProgress, userAssignmentsQuery } from "@/shared/api/assignments";
import { QUERY_KEYS } from "@/shared/api/query-keys";
import type { Assignment } from "@/shared/api/types";
import { matchesStatusFilter, summarizeAssignments } from "@/shared/lib/assignments";
import type { StatusFilter } from "@/shared/types/induction";
import { useAuth } from "@/features/auth/use-auth";

/** The current person's assignments plus done/total counts. */
export function useMyAssignments() {
  const { userId } = useAuth();
  const query = useQuery(userAssignmentsQuery(userId));
  const assignments = query.data ?? [];
  return { ...query, assignments, summary: summarizeAssignments(assignments) };
}

type AssignmentKind = "course" | "document";

function isOfKind(assignment: Assignment, kind: AssignmentKind): boolean {
  return kind === "course" ? !!assignment.course_id : !!assignment.document_id;
}

/** The current person's courses or documents that match the status filter. */
export function useFilteredAssignments(kind: AssignmentKind, filter: StatusFilter) {
  const { assignments, summary, isLoading } = useMyAssignments();
  const visibleAssignments = assignments.filter(
    (assignment) => isOfKind(assignment, kind) && matchesStatusFilter(assignment, filter),
  );
  return { visibleAssignments, summary, isLoading };
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-progress"],
    mutationFn: ({ assignmentId, progress }: { assignmentId: string; progress: number }) =>
      updateAssignmentProgress(assignmentId, progress),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assignments }),
  });
}
