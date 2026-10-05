import { isDatePast } from "./dates";
import type { StatusFilter } from "@/shared/types/induction";

/**
 * Purpose: business rules for assignment progress, shared by every page.
 * Constraints: progress is 0–100 (enforced by a database check); 100 means done.
 */
export const COMPLETE_PROGRESS = 100;

export type AssignmentStatus = "done" | "overdue" | "inProgress" | "notStarted";

interface ProgressFields {
  progress: number;
  due_date: string | null;
}

export function isAssignmentComplete({ progress }: Pick<ProgressFields, "progress">): boolean {
  return progress >= COMPLETE_PROGRESS;
}

export function isAssignmentOverdue(assignment: ProgressFields, now: Date = new Date()): boolean {
  if (!assignment.due_date || isAssignmentComplete(assignment)) return false;
  return isDatePast(assignment.due_date, now);
}

export function getAssignmentStatus(
  assignment: ProgressFields,
  now: Date = new Date(),
): AssignmentStatus {
  if (isAssignmentComplete(assignment)) return "done";
  if (isAssignmentOverdue(assignment, now)) return "overdue";
  return assignment.progress > 0 ? "inProgress" : "notStarted";
}

export function matchesStatusFilter(
  assignment: Pick<ProgressFields, "progress">,
  filter: StatusFilter,
): boolean {
  if (filter === "All") return true;
  return filter === "Completed"
    ? isAssignmentComplete(assignment)
    : !isAssignmentComplete(assignment);
}

export function calculatePercent(part: number, total: number): number {
  return total > 0 ? Math.round((part / total) * 100) : 0;
}

/** Caps progress at 100 so a step never overshoots the database range check. */
export function clampProgress(progress: number): number {
  return Math.min(COMPLETE_PROGRESS, Math.max(0, progress));
}

interface SummarizableAssignment {
  progress: number;
  course_id: string | null;
  document_id: string | null;
}

export interface AssignmentSummary {
  doneCount: number;
  totalCount: number;
  percentDone: number;
  documentsDone: number;
  documentsTotal: number;
  coursesDone: number;
  coursesTotal: number;
}

/** Counts finished items overall and per type (documents / courses). */
export function summarizeAssignments(assignments: SummarizableAssignment[]): AssignmentSummary {
  const documents = assignments.filter((assignment) => assignment.document_id);
  const courses = assignments.filter((assignment) => assignment.course_id);
  const doneCount = assignments.filter(isAssignmentComplete).length;
  return {
    doneCount,
    totalCount: assignments.length,
    percentDone: calculatePercent(doneCount, assignments.length),
    documentsDone: documents.filter(isAssignmentComplete).length,
    documentsTotal: documents.length,
    coursesDone: courses.filter(isAssignmentComplete).length,
    coursesTotal: courses.length,
  };
}

export function countOverdueAssignments(
  assignments: ProgressFields[],
  now: Date = new Date(),
): number {
  return assignments.filter((assignment) => isAssignmentOverdue(assignment, now)).length;
}
