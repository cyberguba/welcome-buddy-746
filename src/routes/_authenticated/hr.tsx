import { createFileRoute } from "@tanstack/react-router";
import { HrPage } from "@/features/admin/HrPage";
import { buildPageMeta } from "@/shared/lib/seo";

export const Route = createFileRoute("/_authenticated/hr")({
  head: () =>
    buildPageMeta(
      "HR haldus",
      "Määra koolitusi ja dokumente, halda teeki ja jälgi iga töötaja sisseelamist.",
    ),
  component: HrPage,
});
