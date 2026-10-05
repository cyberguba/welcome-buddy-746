import { z } from "zod";
import { COURSE_IMAGE_KEYS } from "@/shared/lib/course-images";

/**
 * Purpose: validates every value a user types or uploads before it reaches the database or storage.
 * The database still enforces its own constraints; this gives a clear message first.
 */
export const MAX_PDF_SIZE_MB = 20;
const BYTES_PER_MB = 1024 * 1024;
const PDF_CONTENT_TYPE = "application/pdf";
const MAX_TITLE_LENGTH = 200;
const MAX_DESCRIPTION_LENGTH = 2000;

export type ValidationMessageKey = "invalidInput" | "pdfOnly" | "pdfTooLarge";

/** An input problem the user can fix; the toast shows its translated message. */
export class ValidationError extends Error {
  constructor(readonly messageKey: ValidationMessageKey) {
    super(`Validation failed: ${messageKey}`);
    this.name = "ValidationError";
  }
}

const titleSchema = z.string().trim().min(1).max(MAX_TITLE_LENGTH);
const descriptionSchema = z.string().trim().max(MAX_DESCRIPTION_LENGTH);

export const courseInputSchema = z.object({
  title: titleSchema,
  category: z.string().trim().min(1).max(MAX_TITLE_LENGTH),
  description: descriptionSchema,
  minutes: z.number().int().min(1).max(600),
  image_key: z.enum(COURSE_IMAGE_KEYS),
});
export type CourseInput = z.infer<typeof courseInputSchema>;

export const documentInputSchema = z.object({
  title: titleSchema,
  description: descriptionSchema,
  pages: z.number().int().min(1).max(5000),
  requires_signature: z.boolean(),
});
export type DocumentInput = z.infer<typeof documentInputSchema>;

export const uuidSchema = z.string().uuid();

const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

/** Parses form input against a schema, throwing a ValidationError the UI can translate. */
export function parseInput<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) throw new ValidationError("invalidInput");
  return result.data;
}

/** Date inputs give "" when cleared; the database stores that as no due date. */
export function parseDueDate(value: string): string | null {
  if (value === "") return null;
  return parseInput(isoDateSchema, value);
}

export function validatePdfFile(file: File): void {
  if (file.type !== PDF_CONTENT_TYPE) throw new ValidationError("pdfOnly");
  if (file.size > MAX_PDF_SIZE_MB * BYTES_PER_MB) throw new ValidationError("pdfTooLarge");
}
