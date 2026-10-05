# Full induction plan (timeline)

## What the user gets
A new **My plan** page showing every assigned document and course on one timeline, grouped by due date:

- **Overdue** (red), then **This week**, **Next week**, then later weeks ("Week of 12 Oct"), and **No due date** at the end.
- Each row shows: type (Document / Course), title, due date, status (Not started / In progress / Done / Overdue) and a small progress bar. Clicking a row opens the Documents or Courses page.
- A summary at the top: overall %, items done, overdue count, and the last due date ("Plan finishes 30 Oct").
- A "Hide completed" switch.

## Who sees it
- **Employees:** "My plan" in the top menu shows their own plan.
- **HR and managers:** a **View plan** button next to each person in HR admin > Progress and My team opens that person's plan (read-only, with their name at the top).
- The Overview page gets a "See full plan" link.

## Technical details
- Route `src/routes/_authenticated/plan.tsx` with optional `?user=<id>` search param; page `src/pages/PlanPage.tsx`.
- New `src/components/plan/PlanTimeline.tsx` + `PlanItemRow.tsx`; grouping helper `groupByWeek()` in `src/lib/format.ts`.
- Data from existing `assignmentsQuery(userId)` and `profilesQuery`; no database changes.
- Add nav item in `navigation.ts`; add "View plan" link in `ProgressTable.tsx`; add link on `OverviewPage.tsx`.
