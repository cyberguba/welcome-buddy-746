import { useT } from "@/shared/i18n";
import { useState } from "react";
import { SectionHeader } from "@/shared/components/SectionHeader";
import { StatusFilterBar } from "@/shared/components/StatusFilterBar";
import { EmptyState } from "@/shared/components/EmptyState";
import { CourseCard } from "@/features/courses/components/CourseCard";
import { useMyAssignments } from "@/features/assignments/use-my-assignments";
import type { StatusFilter } from "@/shared/types/induction";

export function CoursesPage() {
  const { t } = useT();
  const { list, totals, isLoading } = useMyAssignments();
  const [filter, setFilter] = useState<StatusFilter>("All");

  const visible = list.filter((a) => {
    if (!a.course_id) return false;
    const done = a.progress >= 100;
    return filter === "All" || (filter === "Completed" ? done : !done);
  });

  return (
    <section className="mt-7">
      <SectionHeader
        title={t.courses.title}
        meta={t.common.completedOf(totals.coursesDone, totals.coursesTotal)}
      />
      <StatusFilterBar value={filter} onChange={setFilter} />
      <div className="grid gap-4 md:grid-cols-3">
        {visible.map((a) => (
          <CourseCard key={a.id} assignment={a} />
        ))}
      </div>
      {!isLoading && visible.length === 0 && <EmptyState message={t.courses.empty} />}
    </section>
  );
}
