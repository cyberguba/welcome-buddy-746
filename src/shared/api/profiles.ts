import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PROFILE_COLUMNS } from "./columns";
import { QUERY_KEYS } from "./query-keys";
import { throwIfError, unwrapData } from "./unwrap";
import type { AppRole, RolesByUser } from "./types";

/**
 * Purpose: reads and writes people (profiles) and their roles.
 * Constraints: access is enforced by row-level security in Supabase, not here.
 */
export const profileWithRolesQuery = (userId: string) =>
  queryOptions({
    queryKey: QUERY_KEYS.profile(userId),
    queryFn: async () => {
      const [profileResult, rolesResult] = await Promise.all([
        supabase.from("profiles").select(PROFILE_COLUMNS).eq("id", userId).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", userId),
      ]);
      throwIfError(profileResult);
      const roleRows = unwrapData(rolesResult);
      return { profile: profileResult.data, roles: roleRows.map((row) => row.role) };
    },
  });

export const profilesQuery = queryOptions({
  queryKey: QUERY_KEYS.profiles,
  queryFn: async () =>
    unwrapData(await supabase.from("profiles").select(PROFILE_COLUMNS).order("full_name")),
});

export const rolesByUserQuery = queryOptions({
  queryKey: QUERY_KEYS.roles,
  queryFn: async () => {
    const roleRows = unwrapData(await supabase.from("user_roles").select("user_id, role"));
    const rolesByUser: RolesByUser = {};
    for (const row of roleRows) (rolesByUser[row.user_id] ??= []).push(row.role);
    return rolesByUser;
  },
});

export async function setUserRole(userId: string, role: AppRole, shouldHaveRole: boolean) {
  const result = shouldHaveRole
    ? await supabase.from("user_roles").insert({ user_id: userId, role })
    : await supabase.from("user_roles").delete().eq("user_id", userId).eq("role", role);
  throwIfError(result);
}

export async function updateManager(userId: string, managerId: string | null) {
  throwIfError(await supabase.from("profiles").update({ manager_id: managerId }).eq("id", userId));
}
