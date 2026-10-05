import { createFileRoute } from "@tanstack/react-router";
import { DocumentsPage } from "@/features/documents/DocumentsPage";
import { pageMeta } from "@/shared/lib/seo";

export const Route = createFileRoute("/_authenticated/documents")({
  head: () => pageMeta("Dokumendid", "Loe ja allkirjasta sulle määratud sisseelamise dokumendid."),
  component: DocumentsPage,
});
