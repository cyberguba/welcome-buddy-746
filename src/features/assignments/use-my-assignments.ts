import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { assignmentsQuery, summarize } from "@/shared/api/induction-api";
import { useAuth } from "@/features/auth/use-auth";

export function useMyAssignments() {
  const { userId } = useAuth();
  const query = useQuery({ ...assignmentsQuery(userId ?? ""), enabled: !!userId });
  const list = query.data ?? [];
  return { ...query, list, totals: summarize(list) };
}

export function useUpdateProgress() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, progress }: { id: string; progress: number }) => {
      const { error } = await supabase.from("assignments").update({ progress: Math.min(100, progress) }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["assignments"] }),
    onError: (error: Error) => {
      console.error("Induction data update failed", error);
      toast.error(error.message);
    },
  });
}
