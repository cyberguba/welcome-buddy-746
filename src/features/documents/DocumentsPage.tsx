import { useT } from "@/shared/i18n";
import { useState } from "react";
import { SectionHeader } from "@/shared/components/SectionHeader";
import { StatusFilterBar } from "@/shared/components/StatusFilterBar";
import { EmptyState } from "@/shared/components/EmptyState";
import { DocumentCard } from "@/features/documents/components/DocumentCard";
import { useMyAssignments } from "@/features/assignments/use-my-assignments";
import type { StatusFilter } from "@/shared/types/induction";

export function DocumentsPage() {
  const { t } = useT();
  const { list, totals, isLoading } = useMyAssignments();
  const [filter, setFilter] = useState<StatusFilter>("All");

  const visible = list.filter((a) => {
    if (!a.document_id) return false;
    const done = a.progress >= 100;
    return filter === "All" || (filter === "Completed" ? done : !done);
  });

  return (
    <section className="mt-7">
      <SectionHeader title={t.documents.title} meta={t.common.completedOf(totals.documentsDone, totals.documentsTotal)} />
      <StatusFilterBar value={filter} onChange={setFilter} />
      <div className="grid gap-4 md:grid-cols-3">
        {visible.map((a) => (
          <DocumentCard key={a.id} assignment={a} />
        ))}
      </div>
      {!isLoading && visible.length === 0 && <EmptyState message={t.documents.empty} />}
    </section>
  );
}
