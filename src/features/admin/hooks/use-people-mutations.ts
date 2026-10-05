import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setUserRole, updateManager } from "@/shared/api/profiles";
import { QUERY_KEYS } from "@/shared/api/query-keys";
import type { AppRole } from "@/shared/api/types";

export function useSetUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["set-user-role"],
    mutationFn: ({
      userId,
      role,
      shouldHaveRole,
    }: {
      userId: string;
      role: AppRole;
      shouldHaveRole: boolean;
    }) => setUserRole(userId, role, shouldHaveRole),
    onSuccess: (_result, { userId }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.roles });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profile(userId) });
    },
  });
}

export function useUpdateManager() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["update-manager"],
    mutationFn: ({ userId, managerId }: { userId: string; managerId: string | null }) =>
      updateManager(userId, managerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.profiles });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.assignments });
    },
  });
}
