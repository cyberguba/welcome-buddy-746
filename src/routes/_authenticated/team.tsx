import { createFileRoute } from "@tanstack/react-router";
import { TeamPage } from "@/features/admin/TeamPage";
import { pageMeta } from "@/shared/lib/seo";

export const Route = createFileRoute("/_authenticated/team")({
  head: () =>
    pageMeta(
      "Minu meeskond",
      "Jälgi oma meeskonna sisseelamist ning määra koolitusi ja dokumente.",
    ),
  component: TeamPage,
});
