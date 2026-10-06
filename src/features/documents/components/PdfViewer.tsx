import { useQuery } from "@tanstack/react-query";
import { useT } from "@/shared/i18n";
import { documentFileUrlQuery } from "@/shared/api/documents";

export function PdfViewer({ filePath }: { filePath: string }) {
  const { t } = useT();
  const { data: fileUrl } = useQuery(documentFileUrlQuery(filePath));
  if (!fileUrl) {
    return (
      <div className="mt-4 text-[0.75rem] text-muted-foreground">{t.documents.loadingPdf}</div>
    );
  }
  return (
    <div className="mt-4 space-y-2">
      <iframe
        src={fileUrl}
        title={t.documents.pdfTitle}
        className="h-[30rem] w-full rounded-xl bg-card ring-1 ring-border"
      />
      <a
        href={fileUrl}
        target="_blank"
        rel="noreferrer"
        className="text-[0.75rem] font-semibold text-primary underline underline-offset-4"
      >
        {t.documents.openPdf}
      </a>
    </div>
  );
}
