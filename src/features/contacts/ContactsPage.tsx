import { useT } from "@/shared/i18n";
import { SectionHeader } from "@/shared/components/SectionHeader";
import { ContactCard } from "@/features/contacts/components/ContactCard";
import { CONTACTS } from "@/features/contacts/contacts";

export function ContactsPage() {
  const { t } = useT();
  return (
    <section className="mt-7">
      <SectionHeader title={t.contacts.title} meta={t.contacts.count(CONTACTS.length)} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {CONTACTS.map((c) => (
          <ContactCard key={c.email} contact={c} />
        ))}
      </div>
    </section>
  );
}
