import { createFileRoute } from "@tanstack/react-router";
import { CoursesPage } from "@/features/courses/CoursesPage";
import { buildPageMeta } from "@/shared/lib/seo";

export const Route = createFileRoute("/courses")({
  head: () => buildPageMeta("Koolitused", "Läbi sulle määratud Postimehe sisseelamise koolitused."),
  component: CoursesPage,
});
