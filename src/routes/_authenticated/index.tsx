import { createFileRoute } from "@tanstack/react-router";
import { OverviewPage } from "@/features/overview/OverviewPage";
import { pageMeta } from "@/shared/lib/seo";

export const Route = createFileRoute("/_authenticated/")({
  head: () =>
    pageMeta(
      "Tere tulemast",
      "Sinu sisseelamise keskkond: kõik dokumendid ja koolitused Postimehes alustamiseks.",
    ),
  component: OverviewPage,
});
