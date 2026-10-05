import { useQuery } from "@tanstack/react-query";
import { useT } from "@/shared/i18n";
import { profilesQuery, rolesByUserQuery } from "@/shared/api/profiles";
import { getPrimaryRole } from "@/shared/lib/roles";
import { useIsMobile } from "@/hooks/use-mobile";
import { useAuth } from "@/features/auth/use-auth";

/** DEMO MODE: picks which person the app shows. Remove together with demo mode. */
export function ViewAsPicker() {
  const { userId, setViewAs } = useAuth();
  const { t } = useT();
  const isMobile = useIsMobile();
  const { data: people = [] } = useQuery(profilesQuery);
  const { data: rolesByUser = {} } = useQuery(rolesByUserQuery);

  return (
    <label className="min-w-0 text-right">
      <span className="hidden text-[10px] font-medium uppercase tracking-wide text-muted-foreground sm:block">
        {t.header.viewingAs}
      </span>
      <select
        value={userId}
        onChange={(event) => setViewAs(event.target.value)}
        className="w-full max-w-[170px] truncate bg-transparent text-right text-[12px] font-semibold outline-none"
        aria-label={t.header.viewAsAria}
      >
        {people.map((person) => (
          <option key={person.id} value={person.id}>
            {person.full_name}
            {isMobile ? "" : ` · ${t.roles[getPrimaryRole(rolesByUser[person.id] ?? [])]}`}
          </option>
        ))}
      </select>
    </label>
  );
}
