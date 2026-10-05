import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { DOCUMENT_COLUMNS } from "./columns";
import { QUERY_KEYS } from "./query-keys";
import { throwIfError, unwrapData } from "./unwrap";
import { documentInputSchema, parseInput, validatePdfFile, type DocumentInput } from "./validation";

/**
 * Purpose: reads and writes induction documents and their PDF files.
 * Dependencies: the private "documents" storage bucket; files are opened through short-lived signed URLs.
 */
const DOCUMENTS_BUCKET = "documents";
const SIGNED_URL_TTL_SECONDS = 60 * 60;
// Refresh the cached URL 10 minutes before it expires so an open viewer never gets a dead link.
const SIGNED_URL_STALE_TIME_MS = (SIGNED_URL_TTL_SECONDS - 10 * 60) * 1000;

export const documentsQuery = queryOptions({
  queryKey: QUERY_KEYS.documents,
  queryFn: async () =>
    unwrapData(await supabase.from("documents").select(DOCUMENT_COLUMNS).order("created_at")),
});

export const documentFileUrlQuery = (filePath: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.documentFile(filePath),
    staleTime: SIGNED_URL_STALE_TIME_MS,
    queryFn: async () => {
      const signedUrl = unwrapData(
        await supabase.storage
          .from(DOCUMENTS_BUCKET)
          .createSignedUrl(filePath, SIGNED_URL_TTL_SECONDS),
      );
      return signedUrl.signedUrl;
    },
  });

/** Uploads a PDF under a random name and returns its storage path. */
async function uploadDocumentPdf(file: File): Promise<string> {
  validatePdfFile(file);
  const filePath = `${crypto.randomUUID()}.pdf`;
  throwIfError(
    await supabase.storage
      .from(DOCUMENTS_BUCKET)
      .upload(filePath, file, { contentType: "application/pdf" }),
  );
  return filePath;
}

export async function createDocument(input: DocumentInput, pdfFile: File | null) {
  const document = parseInput(documentInputSchema, input);
  const filePath = pdfFile ? await uploadDocumentPdf(pdfFile) : null;
  throwIfError(await supabase.from("documents").insert({ ...document, file_path: filePath }));
}

export async function attachDocumentPdf(documentId: string, pdfFile: File) {
  const filePath = await uploadDocumentPdf(pdfFile);
  throwIfError(
    await supabase.from("documents").update({ file_path: filePath }).eq("id", documentId),
  );
}

export async function deleteDocument(documentId: string) {
  throwIfError(await supabase.from("documents").delete().eq("id", documentId));
}
