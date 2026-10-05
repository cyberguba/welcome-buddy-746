import { createFileRoute } from "@tanstack/react-router";
import { ContactsPage } from "@/features/contacts/ContactsPage";
import { buildPageMeta } from "@/shared/lib/seo";

export const Route = createFileRoute("/contacts")({
  head: () =>
    buildPageMeta(
      "Kontaktid",
      "Kelle poole Postimehes pöörduda IT, personali, kontori ja muude küsimustega.",
    ),
  component: ContactsPage,
});
