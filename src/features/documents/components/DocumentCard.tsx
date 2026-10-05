import { useState } from "react";
import { useT } from "@/shared/i18n";
import { cn } from "@/lib/utils";
import type { Assignment } from "@/shared/api/types";
import { COMPLETE_PROGRESS, getAssignmentStatus } from "@/shared/lib/assignments";
import { formatDueLabel } from "@/shared/lib/format";
import { useUpdateProgress } from "@/features/assignments/use-my-assignments";
import { PdfViewer } from "./PdfViewer";

type DocumentBadge = "completed" | "overdue" | "pending";

const BADGE_CLASS: Record<DocumentBadge, string> = {
  completed: "bg-success/15 text-success",
  overdue: "bg-destructive/15 text-destructive",
  pending: "bg-warning/15 text-warning",
};

export function DocumentCard({ assignment }: { assignment: Assignment }) {
  const updateProgress = useUpdateProgress();
  const { t, lang } = useT();
  const [isOpen, setIsOpen] = useState(false);
  const document = assignment.document;
  if (!document) return null;

  const status = getAssignmentStatus(assignment);
  const isCompleted = status === "done";
  const badge: DocumentBadge = isCompleted
    ? "completed"
    : status === "overdue"
      ? "overdue"
      : "pending";
  const badgeLabels: Record<DocumentBadge, string> = {
    completed: document.requires_signature ? t.documents.signed : t.documents.read,
    overdue: t.common.overdue,
    pending: t.common.pending,
  };

  const confirmDocument = () => {
    updateProgress.mutate({ assignmentId: assignment.id, progress: COMPLETE_PROGRESS });
    setIsOpen(false);
  };

  return (
    <div className="glass animate-rise rounded-2xl p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-display text-[14px] font-bold">{document.title}</h3>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide",
            BADGE_CLASS[badge],
          )}
        >
          {badgeLabels[badge]}
        </span>
      </div>
      <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
        {document.description}
      </p>
      <div className="mt-1 text-[11px] text-muted-foreground">
        {t.documents.pages(document.pages)} · {formatDueLabel(assignment.due_date, lang)}
      </div>

      {isOpen && document.file_path && <PdfViewer filePath={document.file_path} />}
      {isOpen && !document.file_path && (
        <div className="mt-4 rounded-xl bg-card/70 p-4 text-[12px] leading-relaxed text-muted-foreground ring-1 ring-border">
          {t.documents.preview(document.title)}
        </div>
      )}

      <div className="mt-4 flex items-center gap-3">
        {isCompleted ? (
          <button
            type="button"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
            className="text-[12px] font-semibold text-muted-foreground underline decoration-border underline-offset-4"
          >
            {isOpen ? t.documents.hide : t.documents.view}
          </button>
        ) : isOpen ? (
          <button
            type="button"
            disabled={updateProgress.isPending}
            onClick={confirmDocument}
            className="rounded-lg bg-primary px-3 py-1.5 text-[12px] font-semibold text-primary-foreground shadow-primary transition hover:opacity-90"
          >
            {document.requires_signature ? t.documents.sign : t.documents.markRead}
          </button>
        ) : (
          <button
            type="button"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(true)}
            className="rounded-lg bg-accent px-3 py-1.5 text-[12px] font-semibold text-accent-foreground transition hover:bg-primary/20"
          >
            {document.requires_signature ? t.documents.reviewSign : t.documents.readBtn}
          </button>
        )}
      </div>
    </div>
  );
}
