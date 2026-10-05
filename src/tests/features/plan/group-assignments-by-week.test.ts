import { describe, expect, it } from "vitest";
import { groupAssignmentsByWeek } from "@/features/plan/group-assignments-by-week";

// Wednesday; the week starts on Monday 2026-10-05.
const NOW = new Date("2026-10-07T12:00:00");

function buildItem(id: string, due_date: string | null, progress = 0) {
  return { id, due_date, progress };
}

describe("groupAssignmentsByWeek", () => {
  it("orders groups: overdue, this week, next week, later weeks, no due date", () => {
    const groups = groupAssignmentsByWeek(
      [
        buildItem("none", null),
        buildItem("later", "2026-10-28"),
        buildItem("next", "2026-10-13"),
        buildItem("overdue", "2026-10-01"),
        buildItem("this", "2026-10-09"),
      ],
      "en",
      NOW,
    );
    expect(groups.map((group) => group.label)).toEqual([
      "Overdue",
      "This week",
      "Next week",
      "Week of 26 Oct",
      "No due date",
    ]);
  });

  it("puts finished past items in their week, not in overdue", () => {
    const groups = groupAssignmentsByWeek([buildItem("done", "2026-10-06", 100)], "en", NOW);
    expect(groups).toHaveLength(1);
    expect(groups[0]?.tone).toBe("week");
  });

  it("sorts items inside a group by due date", () => {
    const groups = groupAssignmentsByWeek(
      [buildItem("friday", "2026-10-09"), buildItem("thursday", "2026-10-08")],
      "en",
      NOW,
    );
    expect(groups[0]?.items.map((item) => item.id)).toEqual(["thursday", "friday"]);
  });

  it("returns no groups for no items", () => {
    expect(groupAssignmentsByWeek([], "en", NOW)).toEqual([]);
  });
});
