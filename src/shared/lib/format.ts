import { DICTS, LOCALES, type Lang } from "@/shared/i18n/dictionaries";
import { COMPLETE_PROGRESS } from "./assignments";
import { parseLocalDate } from "./dates";
import type { Profile } from "@/shared/api/types";

const SHORT_DATE_FORMAT: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };

export function formatShortDate(date: Date | string, lang: Lang): string {
  const parsedDate = typeof date === "string" ? parseLocalDate(date) : date;
  return parsedDate.toLocaleDateString(LOCALES[lang], SHORT_DATE_FORMAT);
}

export function formatDueLabel(dueDate: string | null, lang: Lang): string {
  const text = DICTS[lang].common;
  return dueDate ? text.due(formatShortDate(dueDate, lang)) : text.noDue;
}

/** "Not started · 15 min", "40% · 9 min left" or "Completed". */
export function formatCourseProgress(progress: number, courseMinutes: number, lang: Lang): string {
  const text = DICTS[lang].course;
  if (progress >= COMPLETE_PROGRESS) return text.completed;
  if (progress <= 0) return text.notStarted(courseMinutes);
  const minutesLeft = Math.max(
    1,
    Math.round((courseMinutes * (COMPLETE_PROGRESS - progress)) / 100),
  );
  return text.left(progress, minutesLeft);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

export function getDisplayName(person: Pick<Profile, "full_name" | "email">): string {
  return person.full_name || person.email;
}

export function getFirstName(fullName: string): string {
  return fullName.split(" ")[0] ?? "";
}

export function buildPhoneHref(phone: string): string {
  return `tel:${phone.replace(/\s/g, "")}`;
}
