import { describe, expect, it } from "vitest";
import {
  calculatePercent,
  clampProgress,
  countOverdueAssignments,
  getAssignmentStatus,
  isAssignmentOverdue,
  matchesStatusFilter,
  summarizeAssignments,
} from "@/shared/lib/assignments";

const NOW = new Date("2026-10-07T12:00:00");

function buildAssignment(
  overrides: Partial<{
    progress: number;
    due_date: string | null;
    course_id: string | null;
    document_id: string | null;
  }> = {},
) {
  return { progress: 0, due_date: null, course_id: "course-1", document_id: null, ...overrides };
}

describe("isAssignmentOverdue", () => {
  it("is overdue when the due day has fully passed and the item is unfinished", () => {
    expect(isAssignmentOverdue(buildAssignment({ due_date: "2026-10-06" }), NOW)).toBe(true);
  });

  it("is not overdue on the due day itself", () => {
    expect(isAssignmentOverdue(buildAssignment({ due_date: "2026-10-07" }), NOW)).toBe(false);
  });

  it("is never overdue when finished or without a due date", () => {
    expect(
      isAssignmentOverdue(buildAssignment({ due_date: "2026-01-01", progress: 100 }), NOW),
    ).toBe(false);
    expect(isAssignmentOverdue(buildAssignment({ due_date: null }), NOW)).toBe(false);
  });
});

describe("getAssignmentStatus", () => {
  it.each([
    [{ progress: 100, due_date: "2026-01-01" }, "done"],
    [{ progress: 40, due_date: "2026-01-01" }, "overdue"],
    [{ progress: 40, due_date: null }, "inProgress"],
    [{ progress: 0, due_date: "2026-12-01" }, "notStarted"],
  ] as const)("%o -> %s", (fields, expectedStatus) => {
    expect(getAssignmentStatus(buildAssignment(fields), NOW)).toBe(expectedStatus);
  });
});

describe("matchesStatusFilter", () => {
  it("splits finished and unfinished items", () => {
    const finished = buildAssignment({ progress: 100 });
    const unfinished = buildAssignment({ progress: 99 });
    expect(matchesStatusFilter(finished, "Completed")).toBe(true);
    expect(matchesStatusFilter(unfinished, "Completed")).toBe(false);
    expect(matchesStatusFilter(unfinished, "Pending")).toBe(true);
    expect(matchesStatusFilter(finished, "All")).toBe(true);
  });
});

describe("calculatePercent", () => {
  it("rounds and returns 0 for an empty total", () => {
    expect(calculatePercent(1, 3)).toBe(33);
    expect(calculatePercent(0, 0)).toBe(0);
  });
});

describe("clampProgress", () => {
  it("keeps progress inside 0–100", () => {
    expect(clampProgress(136)).toBe(100);
    expect(clampProgress(-5)).toBe(0);
    expect(clampProgress(68)).toBe(68);
  });
});

describe("summarizeAssignments", () => {
  it("counts done items overall and per type", () => {
    const summary = summarizeAssignments([
      buildAssignment({ progress: 100 }),
      buildAssignment({ progress: 50 }),
      buildAssignment({ course_id: null, document_id: "document-1", progress: 100 }),
    ]);
    expect(summary).toEqual({
      doneCount: 2,
      totalCount: 3,
      percentDone: 67,
      coursesDone: 1,
      coursesTotal: 2,
      documentsDone: 1,
      documentsTotal: 1,
    });
  });

  it("handles an empty list", () => {
    expect(summarizeAssignments([]).percentDone).toBe(0);
  });
});

describe("countOverdueAssignments", () => {
  it("counts only unfinished past-due items", () => {
    const assignments = [
      buildAssignment({ due_date: "2026-10-01" }),
      buildAssignment({ due_date: "2026-10-01", progress: 100 }),
      buildAssignment({ due_date: "2026-10-30" }),
    ];
    expect(countOverdueAssignments(assignments, NOW)).toBe(1);
  });
});
