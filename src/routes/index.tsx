import { createFileRoute } from "@tanstack/react-router";
import { OverviewPage } from "@/features/overview/OverviewPage";
import { buildPageMeta } from "@/shared/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    buildPageMeta(
      "Tere tulemast",
      "Sinu sisseelamise keskkond: kõik dokumendid ja koolitused Postimehes alustamiseks.",
    ),
  component: OverviewPage,
});
