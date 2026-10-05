import { describe, expect, it } from "vitest";
import { countWeeksBetween, getStartOfWeek, isDatePast, parseLocalDate } from "@/shared/lib/dates";

describe("parseLocalDate", () => {
  it("keeps the calendar day in local time", () => {
    const date = parseLocalDate("2026-10-05");
    expect([date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()]).toEqual([
      2026, 9, 5, 0,
    ]);
  });
});

describe("getStartOfWeek", () => {
  it("returns Monday for any day of the week, including Sunday", () => {
    expect(getStartOfWeek(parseLocalDate("2026-10-07")).getDate()).toBe(5);
    expect(getStartOfWeek(parseLocalDate("2026-10-11")).getDate()).toBe(5);
    expect(getStartOfWeek(parseLocalDate("2026-10-05")).getDate()).toBe(5);
  });
});

describe("countWeeksBetween", () => {
  it("counts whole weeks between two Mondays", () => {
    expect(countWeeksBetween(parseLocalDate("2026-10-05"), parseLocalDate("2026-10-19"))).toBe(2);
  });
});

describe("isDatePast", () => {
  it("is false until the day has ended", () => {
    expect(isDatePast("2026-10-05", new Date("2026-10-05T23:00:00"))).toBe(false);
    expect(isDatePast("2026-10-05", new Date("2026-10-06T00:00:01"))).toBe(true);
  });
});
