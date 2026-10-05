import { useState } from "react";
import { useT } from "@/shared/i18n";
import { SectionHeader } from "@/shared/components/SectionHeader";
import { StatusFilterBar } from "@/shared/components/StatusFilterBar";
import { EmptyState } from "@/shared/components/EmptyState";
import type { StatusFilter } from "@/shared/types/induction";
import { useFilteredAssignments } from "@/features/assignments/use-my-assignments";
import { DocumentCard } from "./components/DocumentCard";

export function DocumentsPage() {
  const { t } = useT();
  const [filter, setFilter] = useState<StatusFilter>("All");
  const { visibleAssignments, summary, isLoading } = useFilteredAssignments("document", filter);

  return (
    <section className="mt-7">
      <SectionHeader
        title={t.documents.title}
        meta={t.common.completedOf(summary.documentsDone, summary.documentsTotal)}
      />
      <StatusFilterBar value={filter} onChange={setFilter} />
      <div className="grid gap-4 md:grid-cols-3">
        {visibleAssignments.map((assignment) => (
          <DocumentCard key={assignment.id} assignment={assignment} />
        ))}
      </div>
      {!isLoading && visibleAssignments.length === 0 && <EmptyState message={t.documents.empty} />}
    </section>
  );
}
