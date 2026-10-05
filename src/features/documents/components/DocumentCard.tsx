import { useT } from "@/shared/i18n";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { dueLabel, isOverdue } from "@/shared/lib/format";
import { useUpdateProgress } from "@/features/assignments/use-my-assignments";
import { documentFileUrlQuery, type Assignment } from "@/shared/api/induction-api";

function PdfViewer({ path }: { path: string }) {
  const { t } = useT();
  const { data: url, isLoading } = useQuery(documentFileUrlQuery(path));
  if (isLoading || !url) return <div className="mt-4 text-[12px] text-muted-foreground">{t.documents.loadingPdf}</div>;
  return (
    <div className="mt-4 space-y-2">
      <iframe src={url} title={t.documents.pdfTitle} className="h-[480px] w-full rounded-xl bg-card ring-1 ring-border" />
      <a href={url} target="_blank" rel="noreferrer" className="text-[12px] font-semibold text-primary underline underline-offset-4">
        {t.documents.openPdf}
      </a>
    </div>
  );
}

export function DocumentCard({ assignment }: { assignment: Assignment }) {
  const document = assignment.document;
  const update = useUpdateProgress();
  const { t, lang } = useT();
  const [open, setOpen] = useState(false);
  if (!document) return null;
  const completed = assignment.progress >= 100;
  const completedLabel = document.requires_signature ? t.documents.signed : t.documents.read;
  const overdue = isOverdue(assignment.due_date, assignment.progress);

  const confirm = () => {
    update.mutate({ id: assignment.id, progress: 100 });
    setOpen(false);
  };

  return (
    <div className="glass animate-rise rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-[14px] font-bold">{document.title}</h3>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
            completed ? "bg-success/15 text-success" : overdue ? "bg-destructive/15 text-destructive" : "bg-warning/15 text-warning",
          )}
        >
          {completed ? completedLabel : overdue ? t.common.overdue : t.common.pending}
        </span>
      </div>
      <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">{document.description}</p>
      <div className="mt-1 text-[11px] text-muted-foreground">
        {t.documents.pages(document.pages)} · {dueLabel(assignment.due_date, lang)}
      </div>

      {open && document.file_path && <PdfViewer path={document.file_path} />}
      {open && !document.file_path && (
        <div className="mt-4 rounded-xl bg-card/70 p-4 text-[12px] leading-relaxed text-muted-foreground ring-1 ring-border">
          {t.documents.preview(document.title)}
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        {completed ? (
          <button type="button" onClick={() => setOpen(!open)} className="text-[12px] font-semibold text-muted-foreground underline decoration-border underline-offset-4">
            {open ? t.documents.hide : t.documents.view}
          </button>
        ) : open ? (
          <button type="button" disabled={update.isPending} onClick={confirm} className="rounded-lg bg-primary px-3 py-1.5 text-[12px] font-semibold text-primary-foreground shadow-primary transition hover:opacity-90">
            {document.requires_signature ? t.documents.sign : t.documents.markRead}
          </button>
        ) : (
          <button type="button" onClick={() => setOpen(true)} className="rounded-lg bg-accent px-3 py-1.5 text-[12px] font-semibold text-accent-foreground transition hover:bg-primary/20">
            {document.requires_signature ? t.documents.reviewSign : t.documents.readBtn}
          </button>
        )}
      </div>
    </div>
  );
}
