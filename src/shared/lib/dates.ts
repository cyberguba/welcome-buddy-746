const MILLISECONDS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

/** Parses a `YYYY-MM-DD` date column as local midnight (not UTC), so the day never shifts. */
export function parseLocalDate(date: string): Date {
  return new Date(`${date}T00:00:00`);
}

export function getStartOfDay(date: Date): Date {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
}

export function getStartOfWeek(date: Date): Date {
  const monday = getStartOfDay(date);
  const daysSinceMonday = (monday.getDay() + 6) % 7;
  monday.setDate(monday.getDate() - daysSinceMonday);
  return monday;
}

export function countWeeksBetween(fromWeekStart: Date, toWeekStart: Date): number {
  return Math.round((toWeekStart.getTime() - fromWeekStart.getTime()) / MILLISECONDS_PER_WEEK);
}

/** True when the whole due day has passed. */
export function isDatePast(date: string, now: Date = new Date()): boolean {
  const endOfDueDay = parseLocalDate(date);
  endOfDueDay.setHours(23, 59, 59, 999);
  return endOfDueDay < now;
}
