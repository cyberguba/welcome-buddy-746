import { cn } from "@/lib/utils";
import { useT } from "@/shared/i18n";
import type { AppRole, Profile } from "@/shared/api/types";
import { getDisplayName } from "@/shared/lib/format";
import { ROLES_BY_RANK } from "@/shared/lib/roles";
import { useAuth } from "@/features/auth/use-auth";
import { useSetUserRole, useUpdateManager } from "../hooks/use-people-mutations";

interface PersonRolesRowProps {
  person: Profile;
  roles: AppRole[];
  managerOptions: Profile[];
}

export function PersonRolesRow({ person, roles, managerOptions }: PersonRolesRowProps) {
  const { userId } = useAuth();
  const { t } = useT();
  const setUserRole = useSetUserRole();
  const updateManager = useUpdateManager();
  const displayName = getDisplayName(person);

  return (
    <div className="flex flex-wrap items-center gap-4 border-b border-border px-5 py-4 last:border-0">
      <div className="min-w-[11.25rem] flex-1">
        <div className="text-[0.8125rem] font-semibold">{displayName}</div>
        <div className="text-[0.6875rem] text-muted-foreground">{person.email}</div>
      </div>
      <div role="group" aria-label={displayName} className="flex gap-1.5">
        {ROLES_BY_RANK.map((role) => {
          const hasRole = roles.includes(role);
          // Stops HR from locking themselves out; the database policies are the real guard.
          const isOwnHrRole = role === "hr" && person.id === userId;
          return (
            <button
              key={role}
              type="button"
              aria-pressed={hasRole}
              disabled={isOwnHrRole}
              onClick={() =>
                setUserRole.mutate({ userId: person.id, role, shouldHaveRole: !hasRole })
              }
              className={cn(
                "rounded-full px-3 py-1 text-[0.6875rem] font-semibold transition disabled:cursor-not-allowed",
                hasRole ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
              )}
              title={isOwnHrRole ? t.people.selfHr : undefined}
            >
              {t.roles[role]}
            </button>
          );
        })}
      </div>
      <label className="text-[0.6875rem] text-muted-foreground">
        {t.people.manager}{" "}
        <select
          value={person.manager_id ?? ""}
          onChange={(event) =>
            updateManager.mutate({ userId: person.id, managerId: event.target.value || null })
          }
          className="ml-1 rounded-lg bg-card px-2 py-1 text-[0.75rem] text-foreground ring-1 ring-border"
        >
          <option value="">{t.people.none}</option>
          {managerOptions.map((manager) => (
            <option key={manager.id} value={manager.id}>
              {getDisplayName(manager)}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
