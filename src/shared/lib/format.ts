import cultureImg from "@/assets/course-culture.jpg";
import securityImg from "@/assets/course-security.jpg";
import toolsImg from "@/assets/course-tools.jpg";
import safetyImg from "@/assets/course-safety.jpg";
import { DICTS, LOCALES, type Lang } from "@/shared/i18n";

const COURSE_IMAGES: Record<string, string> = {
  culture: cultureImg,
  security: securityImg,
  tools: toolsImg,
  safety: safetyImg,
};

export const COURSE_IMAGE_KEYS = Object.keys(COURSE_IMAGES);

export function courseImage(key: string | null): string {
  return COURSE_IMAGES[key ?? ""] ?? cultureImg;
}

export function courseLabel(pct: number, minutes: number, lang: Lang = "et"): string {
  const t = DICTS[lang].course;
  if (pct >= 100) return t.completed;
  if (pct > 0) return t.left(pct, Math.max(1, Math.round((minutes * (100 - pct)) / 100)));
  return t.notStarted(minutes);
}

export function shortDate(date: string, lang: Lang = "et"): string {
  return new Date(date + "T00:00:00").toLocaleDateString(LOCALES[lang], { day: "numeric", month: "short" });
}

export function dueLabel(date: string | null, lang: Lang = "et"): string {
  const t = DICTS[lang].common;
  if (!date) return t.noDue;
  return t.due(shortDate(date, lang));
}

export function isOverdue(date: string | null, progress: number): boolean {
  if (!date || progress >= 100) return false;
  return new Date(date + "T23:59:59") < new Date();
}

export function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

export function telHref(phone: string): string {
  return `tel:${phone.replace(/\s/g, "")}`;
}

export type PlanGroupKey = "overdue" | "week" | "none";

/** Groups items into Overdue, This week, Next week, Week of …, No due date. */
export function groupByWeek<T extends { due_date: string | null; progress: number }>(items: T[], lang: Lang = "et") {
  const d = DICTS[lang];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monday = (d: Date) => {
    const m = new Date(d);
    m.setDate(m.getDate() - ((m.getDay() + 6) % 7));
    m.setHours(0, 0, 0, 0);
    return m;
  };
  const thisWeek = monday(today).getTime();
  const groups = new Map<string, { key: string; label: string; tone: PlanGroupKey; sort: number; items: T[] }>();
  const add = (key: string, label: string, tone: PlanGroupKey, sort: number, item: T) => {
    if (!groups.has(key)) groups.set(key, { key, label, tone, sort, items: [] });
    groups.get(key)!.items.push(item);
  };
  for (const item of items) {
    if (!item.due_date) add("none", d.common.noDue, "none", Infinity, item);
    else if (isOverdue(item.due_date, item.progress)) add("overdue", d.common.overdue, "overdue", -Infinity, item);
    else {
      const wk = monday(new Date(item.due_date + "T00:00:00")).getTime();
      const diff = Math.round((wk - thisWeek) / (7 * 864e5));
      const label =
        diff <= 0 ? d.weeks.thisWeek : diff === 1 ? d.weeks.nextWeek : d.weeks.weekOf(new Date(wk).toLocaleDateString(LOCALES[lang], { day: "numeric", month: "short" }));
      add(`w${wk}`, label, "week", wk, item);
    }
  }
  const list = [...groups.values()].sort((a, b) => a.sort - b.sort);
  for (const g of list) g.items.sort((a, b) => (a.due_date ?? "").localeCompare(b.due_date ?? ""));
  return list;
}
