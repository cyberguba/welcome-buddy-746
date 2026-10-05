import { useT } from "@/shared/i18n";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { profilesQuery, rolesQuery, type AppRole } from "@/shared/api/induction-api";
import { useAuth } from "@/features/auth/use-auth";

const ROLES: AppRole[] = ["hr", "manager", "employee"];

export function PeoplePanel() {
  const { userId } = useAuth();
  const { t } = useT();
  const qc = useQueryClient();
  const { data: people = [] } = useQuery(profilesQuery);
  const { data: roles = {} } = useQuery(rolesQuery);
  const managers = people.filter((p) => roles[p.id]?.includes("manager"));

  const toggleRole = useMutation({
    mutationFn: async ({ id, role, on }: { id: string; role: AppRole; on: boolean }) => {
      const { error } = on
        ? await supabase.from("user_roles").insert({ user_id: id, role })
        : await supabase.from("user_roles").delete().eq("user_id", id).eq("role", role);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries(),
    onError: (error: Error) => {
      console.error("Induction data update failed", error);
      toast.error(error.message);
    },
  });

  const setManager = useMutation({
    mutationFn: async ({ id, manager }: { id: string; manager: string }) => {
      const { error } = await supabase.from("profiles").update({ manager_id: manager || null }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["profiles"] }),
    onError: (error: Error) => {
      console.error("Induction data update failed", error);
      toast.error(error.message);
    },
  });

  return (
    <div className="glass overflow-hidden rounded-2xl">
      {people.map((p) => (
        <div key={p.id} className="flex flex-wrap items-center gap-4 border-b border-border px-5 py-4 last:border-0">
          <div className="min-w-[180px] flex-1">
            <div className="text-[13px] font-semibold">{p.full_name || p.email}</div>
            <div className="text-[11px] text-muted-foreground">{p.email}</div>
          </div>
          <div className="flex gap-1.5">
            {ROLES.map((r) => {
              const on = roles[p.id]?.includes(r) ?? false;
              const lockSelfHr = r === "hr" && p.id === userId;
              return (
                <button
                  key={r}
                  type="button"
                  disabled={lockSelfHr}
                  onClick={() => toggleRole.mutate({ id: p.id, role: r, on: !on })}
                  className={cn(
                    "rounded-full px-3 py-1 text-[11px] font-semibold transition disabled:cursor-not-allowed",
                    on ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                  title={lockSelfHr ? t.people.selfHr : undefined}
                >
                  {t.roles[r]}
                </button>
              );
            })}
          </div>
          <label className="text-[11px] text-muted-foreground">
            {t.people.manager}{" "}
            <select
              value={p.manager_id ?? ""}
              onChange={(e) => setManager.mutate({ id: p.id, manager: e.target.value })}
              className="ml-1 rounded-lg bg-card px-2 py-1 text-[12px] text-foreground ring-1 ring-border"
            >
              <option value="">{t.people.none}</option>
              {managers
                .filter((m) => m.id !== p.id)
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.full_name || m.email}
                  </option>
                ))}
            </select>
          </label>
        </div>
      ))}
    </div>
  );
}
