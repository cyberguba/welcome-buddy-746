import { DICTS, type Lang } from "@/shared/i18n/dictionaries";
import { isAssignmentOverdue } from "@/shared/lib/assignments";
import { countWeeksBetween, getStartOfWeek, parseLocalDate } from "@/shared/lib/dates";
import { formatShortDate } from "@/shared/lib/format";

export type PlanGroupTone = "overdue" | "week" | "none";

interface PlanItem {
  due_date: string | null;
  progress: number;
}

export interface PlanGroup<T extends PlanItem> {
  key: string;
  label: string;
  tone: PlanGroupTone;
  sortOrder: number;
  items: T[];
}

/**
 * Groups plan items into Overdue, This week, Next week, Week of …, and No due date,
 * ordered by time, with items inside each group ordered by due date.
 */
export function groupAssignmentsByWeek<T extends PlanItem>(
  items: T[],
  lang: Lang,
  now: Date = new Date(),
): PlanGroup<T>[] {
  const text = DICTS[lang];
  const currentWeekStart = getStartOfWeek(now);
  const groupsByKey = new Map<string, PlanGroup<T>>();

  const addToGroup = (group: Omit<PlanGroup<T>, "items">, item: T) => {
    const existingGroup = groupsByKey.get(group.key);
    if (existingGroup) existingGroup.items.push(item);
    else groupsByKey.set(group.key, { ...group, items: [item] });
  };

  const getWeekLabel = (weekStart: Date): string => {
    const weeksAhead = countWeeksBetween(currentWeekStart, weekStart);
    if (weeksAhead <= 0) return text.weeks.thisWeek;
    if (weeksAhead === 1) return text.weeks.nextWeek;
    return text.weeks.weekOf(formatShortDate(weekStart, lang));
  };

  for (const item of items) {
    if (!item.due_date) {
      addToGroup(
        { key: "none", label: text.common.noDue, tone: "none", sortOrder: Infinity },
        item,
      );
    } else if (isAssignmentOverdue(item, now)) {
      addToGroup(
        { key: "overdue", label: text.common.overdue, tone: "overdue", sortOrder: -Infinity },
        item,
      );
    } else {
      const weekStart = getStartOfWeek(parseLocalDate(item.due_date));
      const weekTime = weekStart.getTime();
      addToGroup(
        {
          key: `week-${weekTime}`,
          label: getWeekLabel(weekStart),
          tone: "week",
          sortOrder: weekTime,
        },
        item,
      );
    }
  }

  const groups = [...groupsByKey.values()].sort(
    (first, second) => first.sortOrder - second.sortOrder,
  );
  for (const group of groups) {
    group.items.sort((first, second) =>
      (first.due_date ?? "").localeCompare(second.due_date ?? ""),
    );
  }
  return groups;
}
