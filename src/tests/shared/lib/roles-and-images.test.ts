import { describe, expect, it } from "vitest";
import { getPrimaryRole } from "@/shared/lib/roles";
import { getCourseImage } from "@/shared/lib/course-images";

describe("getPrimaryRole", () => {
  it("returns the highest role, employee when there is none", () => {
    expect(getPrimaryRole(["employee", "hr"])).toBe("hr");
    expect(getPrimaryRole(["manager", "employee"])).toBe("manager");
    expect(getPrimaryRole([])).toBe("employee");
  });
});

describe("getCourseImage", () => {
  it("falls back to the default picture for unknown keys", () => {
    expect(getCourseImage("unknown")).toBe(getCourseImage("culture"));
    expect(getCourseImage(null)).toBe(getCourseImage("culture"));
  });
});
