import { useState } from "react";
import { useT } from "@/shared/i18n";
import { SectionHeader } from "@/shared/components/SectionHeader";
import { StatusFilterBar } from "@/shared/components/StatusFilterBar";
import { EmptyState } from "@/shared/components/EmptyState";
import type { StatusFilter } from "@/shared/types/induction";
import { useFilteredAssignments } from "@/features/assignments/use-my-assignments";
import { CourseCard } from "./components/CourseCard";

export function CoursesPage() {
  const { t } = useT();
  const [filter, setFilter] = useState<StatusFilter>("All");
  const { visibleAssignments, summary, isLoading } = useFilteredAssignments("course", filter);

  return (
    <section className="mt-7">
      <SectionHeader
        title={t.courses.title}
        meta={t.common.completedOf(summary.coursesDone, summary.coursesTotal)}
      />
      <StatusFilterBar value={filter} onChange={setFilter} />
      <div className="grid gap-4 md:grid-cols-3">
        {visibleAssignments.map((assignment) => (
          <CourseCard key={assignment.id} assignment={assignment} />
        ))}
      </div>
      {!isLoading && visibleAssignments.length === 0 && <EmptyState message={t.courses.empty} />}
    </section>
  );
}
