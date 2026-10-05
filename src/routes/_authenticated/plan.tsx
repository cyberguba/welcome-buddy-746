import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { PlanPage } from "@/features/plan/PlanPage";
import { pageMeta } from "@/shared/lib/seo";

export const Route = createFileRoute("/_authenticated/plan")({
  validateSearch: z.object({ user: z.string().optional() }),
  head: () => pageMeta("Sisseelamisplaan", "Sinu kogu Postimehe sisseelamise ajakava tähtaegade järgi."),
  component: PlanRoute,
});

function PlanRoute() {
  const { user } = Route.useSearch();
  return <PlanPage viewUserId={user} />;
}
