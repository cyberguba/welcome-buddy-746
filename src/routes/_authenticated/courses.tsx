import { createFileRoute } from "@tanstack/react-router";
import { CoursesPage } from "@/features/courses/CoursesPage";
import { pageMeta } from "@/shared/lib/seo";

export const Route = createFileRoute("/_authenticated/courses")({
  head: () => pageMeta("Koolitused", "Läbi sulle määratud Postimehe sisseelamise koolitused."),
  component: CoursesPage,
});
