import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useT } from "@/shared/i18n";
import { documentsQuery } from "@/shared/api/documents";
import type { DocumentInput } from "@/shared/api/validation";
import { useCreateDocument, useDeleteDocument } from "../hooks/use-library-mutations";
import { AttachPdfButton } from "./AttachPdfButton";
import { FORM_FIELD_CLASS, SUBMIT_BUTTON_CLASS } from "./form-styles";
import { LibraryItemRow } from "./LibraryItemRow";

const EMPTY_DOCUMENT_FORM: DocumentInput = {
  title: "",
  description: "",
  pages: 1,
  requires_signature: true,
};

export function DocumentLibrary() {
  const { t } = useT();
  const { data: documents = [] } = useQuery(documentsQuery);
  const createDocument = useCreateDocument();
  const deleteDocument = useDeleteDocument();
  const [documentForm, setDocumentForm] = useState<DocumentInput>(EMPTY_DOCUMENT_FORM);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  // Changing the key remounts the file input, which is the only way to clear it.
  const [fileInputKey, setFileInputKey] = useState(0);

  const updateDocumentForm = (changes: Partial<DocumentInput>) =>
    setDocumentForm((current) => ({ ...current, ...changes }));

  const submitDocument = (event: FormEvent) => {
    event.preventDefault();
    createDocument.mutate(
      { input: documentForm, pdfFile },
      {
        onSuccess: () => {
          toast.success(t.library.documentAdded);
          updateDocumentForm({ title: "", description: "" });
          setPdfFile(null);
          setFileInputKey((key) => key + 1);
        },
      },
    );
  };

  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="font-display text-[15px] font-bold">{t.library.documents}</h3>
      <div className="mt-3 space-y-2">
        {documents.map((document) => (
          <div key={document.id} className="space-y-1">
            <LibraryItemRow
              title={document.title}
              meta={`${document.pages} p · ${document.requires_signature ? t.library.sign : t.library.read}`}
              isDeleting={deleteDocument.isPending && deleteDocument.variables === document.id}
              onDelete={() => deleteDocument.mutate(document.id)}
            />
            <AttachPdfButton documentId={document.id} hasPdf={!!document.file_path} />
          </div>
        ))}
      </div>
      <form onSubmit={submitDocument} className="mt-5 space-y-2 border-t border-border pt-4">
        <div className="text-[12px] font-semibold text-muted-foreground">
          {t.library.newDocument}
        </div>
        <input
          className={FORM_FIELD_CLASS}
          placeholder={t.library.titlePh}
          aria-label={t.library.titlePh}
          value={documentForm.title}
          onChange={(event) => updateDocumentForm({ title: event.target.value })}
          required
        />
        <textarea
          className={FORM_FIELD_CLASS}
          placeholder={t.library.descPh}
          aria-label={t.library.descPh}
          rows={2}
          value={documentForm.description}
          onChange={(event) => updateDocumentForm({ description: event.target.value })}
        />
        <input
          key={fileInputKey}
          className={FORM_FIELD_CLASS}
          type="file"
          accept="application/pdf"
          aria-label={t.library.pdfFile}
          onChange={(event) => setPdfFile(event.target.files?.[0] ?? null)}
        />
        <div className="flex items-center gap-3">
          <input
            className={`${FORM_FIELD_CLASS} w-24`}
            type="number"
            min={1}
            value={documentForm.pages}
            onChange={(event) => updateDocumentForm({ pages: Number(event.target.value) })}
            aria-label={t.library.pages}
          />
          <label className="flex items-center gap-2 text-[12px]">
            <input
              type="checkbox"
              className="accent-primary"
              checked={documentForm.requires_signature}
              onChange={(event) => updateDocumentForm({ requires_signature: event.target.checked })}
            />
            {t.library.needsSignature}
          </label>
        </div>
        <button type="submit" disabled={createDocument.isPending} className={SUBMIT_BUTTON_CLASS}>
          {t.library.addDocument}
        </button>
      </form>
    </div>
  );
}
