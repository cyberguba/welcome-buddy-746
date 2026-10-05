import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createAssignments,
  deleteAssignment,
  updateAssignmentDueDate,
  type AssignableItem,
} from "@/shared/api/assignments";
import { QUERY_KEYS } from "@/shared/api/query-keys";

function useInvalidateAssignments() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assignments });
}

export function useCreateAssignments() {
  const invalidateAssignments = useInvalidateAssignments();
  return useMutation({
    mutationKey: ["create-assignments"],
    mutationFn: (input: {
      userId: string;
      items: AssignableItem[];
      dueDate: string;
      assignedBy: string;
    }) => createAssignments(input),
    onSuccess: invalidateAssignments,
  });
}

export function useDeleteAssignment() {
  const invalidateAssignments = useInvalidateAssignments();
  return useMutation({
    mutationKey: ["delete-assignment"],
    mutationFn: (assignmentId: string) => deleteAssignment(assignmentId),
    onSuccess: invalidateAssignments,
  });
}

export function useUpdateAssignmentDueDate() {
  const invalidateAssignments = useInvalidateAssignments();
  return useMutation({
    mutationKey: ["update-assignment-due-date"],
    mutationFn: ({ assignmentId, dueDate }: { assignmentId: string; dueDate: string }) =>
      updateAssignmentDueDate(assignmentId, dueDate),
    onSuccess: invalidateAssignments,
  });
}
