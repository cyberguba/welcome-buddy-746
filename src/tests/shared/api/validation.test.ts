import { describe, expect, it } from "vitest";
import {
  MAX_PDF_SIZE_MB,
  ValidationError,
  courseInputSchema,
  documentInputSchema,
  parseDueDate,
  parseInput,
  validatePdfFile,
} from "@/shared/api/validation";

const VALID_COURSE = {
  title: "IT security",
  category: "Compliance",
  description: "",
  minutes: 20,
  image_key: "security",
};

function buildFile(type: string, sizeInBytes: number): File {
  return new File([new Uint8Array(sizeInBytes)], "file.pdf", { type });
}

describe("parseInput", () => {
  it("trims text and accepts a valid course", () => {
    expect(parseInput(courseInputSchema, { ...VALID_COURSE, title: "  IT security  " }).title).toBe(
      "IT security",
    );
  });

  it.each([
    ["an empty title", { title: "   " }],
    ["zero minutes", { minutes: 0 }],
    ["fractional minutes", { minutes: 1.5 }],
    ["an unknown picture", { image_key: "cats" }],
  ])("rejects a course with %s", (_case, override) => {
    expect(() => parseInput(courseInputSchema, { ...VALID_COURSE, ...override })).toThrow(
      ValidationError,
    );
  });

  it("rejects a document with no pages", () => {
    const document = { title: "NDA", description: "", pages: 0, requires_signature: true };
    expect(() => parseInput(documentInputSchema, document)).toThrow(ValidationError);
  });
});

describe("parseDueDate", () => {
  it("turns an empty input into no due date", () => {
    expect(parseDueDate("")).toBeNull();
  });

  it("accepts ISO dates and rejects anything else", () => {
    expect(parseDueDate("2026-10-05")).toBe("2026-10-05");
    expect(() => parseDueDate("05.10.2026")).toThrow(ValidationError);
  });
});

describe("validatePdfFile", () => {
  it("accepts a small PDF", () => {
    expect(() => validatePdfFile(buildFile("application/pdf", 1024))).not.toThrow();
  });

  it("rejects other file types", () => {
    expect(() => validatePdfFile(buildFile("image/png", 1024))).toThrow(
      expect.objectContaining({ messageKey: "pdfOnly" }),
    );
  });

  it("rejects files over the size limit", () => {
    const tooLarge = buildFile("application/pdf", MAX_PDF_SIZE_MB * 1024 * 1024 + 1);
    expect(() => validatePdfFile(tooLarge)).toThrow(
      expect.objectContaining({ messageKey: "pdfTooLarge" }),
    );
  });
});
