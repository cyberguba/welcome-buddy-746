import { createFileRoute } from "@tanstack/react-router";
import { DocumentsPage } from "@/features/documents/DocumentsPage";
import { buildPageMeta } from "@/shared/lib/seo";

export const Route = createFileRoute("/documents")({
  head: () =>
    buildPageMeta("Dokumendid", "Loe ja allkirjasta sulle määratud sisseelamise dokumendid."),
  component: DocumentsPage,
});
