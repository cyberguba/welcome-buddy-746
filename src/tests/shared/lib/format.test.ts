import { describe, expect, it } from "vitest";
import {
  buildPhoneHref,
  formatCourseProgress,
  formatDueLabel,
  getDisplayName,
  getFirstName,
  getInitials,
} from "@/shared/lib/format";

describe("formatCourseProgress", () => {
  it("describes not started, in progress and completed courses", () => {
    expect(formatCourseProgress(0, 15, "en")).toBe("Not started · 15 min");
    expect(formatCourseProgress(100, 15, "en")).toBe("Completed");
    expect(formatCourseProgress(40, 15, "en")).toContain("9 min");
  });

  it("never shows less than one minute left", () => {
    expect(formatCourseProgress(99, 10, "en")).toContain("1 min");
  });
});

describe("formatDueLabel", () => {
  it("shows the date or a no-due-date text", () => {
    expect(formatDueLabel("2026-10-05", "en")).toContain("5 Oct");
    expect(formatDueLabel(null, "et")).toBe("Tähtaeg puudub");
  });
});

describe("getInitials", () => {
  it("takes the first letter of up to two words", () => {
    expect(getInitials("kadri  tamm saar")).toBe("KT");
    expect(getInitials("")).toBe("");
  });
});

describe("getDisplayName", () => {
  it("falls back to the email when the name is empty", () => {
    expect(getDisplayName({ full_name: "", email: "a@b.ee" })).toBe("a@b.ee");
    expect(getDisplayName({ full_name: "Liis Saar", email: "a@b.ee" })).toBe("Liis Saar");
  });
});

describe("getFirstName", () => {
  it("returns the first word", () => {
    expect(getFirstName("Liis Saar")).toBe("Liis");
  });
});

describe("buildPhoneHref", () => {
  it("removes spaces", () => {
    expect(buildPhoneHref("+372 666 2100")).toBe("tel:+3726662100");
  });
});
