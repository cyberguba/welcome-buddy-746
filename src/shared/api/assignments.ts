import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { clampProgress } from "@/shared/lib/assignments";
import { ASSIGNMENT_COLUMNS } from "./columns";
import { QUERY_KEYS } from "./query-keys";
import { throwIfError, unwrapData } from "./unwrap";
import { parseDueDate } from "./validation";
import type { Assignment } from "./types";

/**
 * Purpose: reads and writes assignments (a course or document given to one person).
 * Constraints: row-level security decides which rows a viewer gets — HR all, managers their team,
 * everyone their own — so "visible" queries need no extra filter here.
 */
function selectAssignments() {
  return supabase
    .from("assignments")
    .select(ASSIGNMENT_COLUMNS)
    .order("due_date", { nullsFirst: false });
}

export const userAssignmentsQuery = (userId: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.userAssignments(userId),
    queryFn: async (): Promise<Assignment[]> =>
      unwrapData(await selectAssignments().eq("user_id", userId)),
  });

export const visibleAssignmentsQuery = queryOptions({
  queryKey: QUERY_KEYS.visibleAssignments,
  queryFn: async (): Promise<Assignment[]> => unwrapData(await selectAssignments()),
});

export type AssignableKind = "course" | "document";

export interface AssignableItem {
  kind: AssignableKind;
  id: string;
}

interface CreateAssignmentsInput {
  userId: string;
  items: AssignableItem[];
  dueDate: string;
  assignedBy: string | null;
}

export async function createAssignments({
  userId,
  items,
  dueDate,
  assignedBy,
}: CreateAssignmentsInput) {
  const parsedDueDate = parseDueDate(dueDate);
  const rows = items.map((item) => ({
    user_id: userId,
    course_id: item.kind === "course" ? item.id : null,
    document_id: item.kind === "document" ? item.id : null,
    due_date: parsedDueDate,
    assigned_by: assignedBy,
  }));
  throwIfError(await supabase.from("assignments").insert(rows));
}

export async function deleteAssignment(assignmentId: string) {
  throwIfError(await supabase.from("assignments").delete().eq("id", assignmentId));
}

export async function updateAssignmentDueDate(assignmentId: string, dueDate: string) {
  throwIfError(
    await supabase
      .from("assignments")
      .update({ due_date: parseDueDate(dueDate) })
      .eq("id", assignmentId),
  );
}

export async function updateAssignmentProgress(assignmentId: string, progress: number) {
  throwIfError(
    await supabase
      .from("assignments")
      .update({ progress: clampProgress(progress) })
      .eq("id", assignmentId),
  );
}
