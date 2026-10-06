import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { PlanPage } from "@/features/plan/PlanPage";
import { uuidSchema } from "@/shared/api/validation";
import { buildPageMeta } from "@/shared/lib/seo";

export const Route = createFileRoute("/plan")({
  // An invalid ?user= value is ignored and the visitor's own plan is shown.
  validateSearch: z.object({ user: uuidSchema.optional().catch(undefined) }),
  head: () =>
    buildPageMeta("Sisseelamisplaan", "Sinu kogu Postimehe sisseelamise ajakava tähtaegade järgi."),
  component: PlanRoute,
});

function PlanRoute() {
  const { user } = Route.useSearch();
  return <PlanPage viewedUserId={user} />;
}
