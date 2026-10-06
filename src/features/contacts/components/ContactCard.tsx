import { useT } from "@/shared/i18n";
import { buildPhoneHref, getInitials } from "@/shared/lib/format";
import type { Contact } from "@/shared/types/induction";

export function ContactCard({ contact }: { contact: Contact }) {
  const { lang } = useT();
  return (
    <div className="glass animate-rise rounded-2xl p-5">
      <div className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-primary">
        {contact.team[lang]}
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-[0.8125rem] font-bold text-accent-foreground">
          {getInitials(contact.name)}
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-[0.875rem] font-bold">{contact.name}</h3>
          <div className="text-[0.6875rem] font-medium text-muted-foreground">
            {contact.role[lang]}
          </div>
        </div>
      </div>
      <p className="mt-3 text-[0.75rem] leading-relaxed text-muted-foreground">
        {contact.help[lang]}
      </p>
      <div className="mt-4 space-y-1 text-[0.75rem]">
        <a
          href={`mailto:${contact.email}`}
          className="block font-semibold text-primary hover:underline"
        >
          {contact.email}
        </a>
        <a href={buildPhoneHref(contact.phone)} className="block text-foreground">
          {contact.phone}
        </a>
        <div className="text-[0.6875rem] text-muted-foreground">{contact.hours[lang]}</div>
      </div>
    </div>
  );
}
