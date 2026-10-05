import { createFileRoute } from "@tanstack/react-router";
import { TeamPage } from "@/features/admin/TeamPage";
import { buildPageMeta } from "@/shared/lib/seo";

export const Route = createFileRoute("/_authenticated/team")({
  head: () =>
    buildPageMeta(
      "Minu meeskond",
      "Jälgi oma meeskonna sisseelamist ning määra koolitusi ja dokumente.",
    ),
  component: TeamPage,
});
