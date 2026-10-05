import { toast } from "sonner";
import { DICTS, readStoredLang, type Dict } from "@/shared/i18n/dictionaries";
import { MAX_PDF_SIZE_MB, ValidationError } from "@/shared/api/validation";
import { logger } from "./logger";

function getErrorMessage(error: unknown, text: Dict["errors"]): string {
  if (!(error instanceof ValidationError)) return text.generic;
  if (error.messageKey === "pdfTooLarge") return text.pdfTooLarge(MAX_PDF_SIZE_MB);
  return text[error.messageKey];
}

/**
 * Logs a failed read or write and shows the user a translated toast.
 * Raw database messages are logged only, never shown, so internals stay hidden.
 */
export function reportDataError(
  error: unknown,
  message: string,
  context: Record<string, unknown> = {},
) {
  logger.error(message, error, context);
  toast.error(getErrorMessage(error, DICTS[readStoredLang()].errors));
}
