import { toast } from "sonner";
import { useT } from "@/shared/i18n";
import { useAttachDocumentPdf } from "../hooks/use-library-mutations";

interface AttachPdfButtonProps {
  documentId: string;
  hasPdf: boolean;
}

export function AttachPdfButton({ documentId, hasPdf }: AttachPdfButtonProps) {
  const { t } = useT();
  const attachPdf = useAttachDocumentPdf();

  return (
    // The file input is visually hidden but stays focusable, so the label works from the keyboard too.
    <label className="ml-3 inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-primary focus-within:underline">
      {hasPdf ? t.library.replacePdf : t.library.attachPdf}
      <input
        type="file"
        accept="application/pdf"
        className="sr-only"
        disabled={attachPdf.isPending}
        onChange={(event) => {
          const pdfFile = event.target.files?.[0];
          if (pdfFile) {
            attachPdf.mutate(
              { documentId, pdfFile },
              { onSuccess: () => toast.success(t.library.pdfAttached) },
            );
          }
          event.target.value = "";
        }}
      />
    </label>
  );
}
