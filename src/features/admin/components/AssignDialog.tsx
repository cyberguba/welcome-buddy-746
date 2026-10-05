import { useT } from "@/shared/i18n";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { assignmentsQuery, coursesQuery, documentsQuery, type Profile } from "@/shared/api/induction-api";
import { dueLabel } from "@/shared/lib/format";
import { useAuth } from "@/features/auth/use-auth";

interface AssignDialogProps {
  employee: Profile | null;
  onClose: () => void;
}

export function AssignDialog({ employee, onClose }: AssignDialogProps) {
  const { userId } = useAuth();
  const { t, lang } = useT();
  const qc = useQueryClient();
  const { data: courses = [] } = useQuery(coursesQuery);
  const { data: documents = [] } = useQuery(documentsQuery);
  const { data: current = [] } = useQuery({ ...assignmentsQuery(employee?.id ?? ""), enabled: !!employee });
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [due, setDue] = useState("");

  const assignedIds = new Set(current.map((a) => a.course_id ?? a.document_id));
  const toggle = (key: string) => {
    const next = new Set(selected);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelected(next);
  };

  const refresh = () => qc.invalidateQueries({ queryKey: ["assignments"] });

  const assign = useMutation({
    mutationFn: async () => {
      if (!employee) return;
      const rows = [...selected].map((key) => {
        const [type, rawId] = key.split(":");
        const id = rawId ?? "";
        return {
          user_id: employee.id,
          course_id: type === "course" ? id : null,
          document_id: type === "document" ? id : null,
          due_date: due || null,
          assigned_by: userId,
        };
      });
      const { error } = await supabase.from("assignments").insert(rows);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t.assign.added(selected.size, employee?.full_name ?? ""));
      setSelected(new Set());
      refresh();
    },
    onError: (error: Error) => {
      console.error("Induction data update failed", error);
      toast.error(error.message);
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("assignments").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: refresh,
    onError: (error: Error) => {
      console.error("Induction data update failed", error);
      toast.error(error.message);
    },
  });

  const updateDue = useMutation({
    mutationFn: async ({ id, date }: { id: string; date: string }) => {
      const { error } = await supabase.from("assignments").update({ due_date: date || null }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: refresh,
    onError: (error: Error) => {
      console.error("Induction data update failed", error);
      toast.error(error.message);
    },
  });

  const option = (key: string, title: string, meta: string) => (
    <label key={key} className="flex cursor-pointer items-center gap-3 rounded-xl bg-card/70 px-3 py-2 ring-1 ring-border">
      <input type="checkbox" checked={selected.has(key)} onChange={() => toggle(key)} className="accent-primary" />
      <span className="flex-1 text-[13px] font-medium">{title}</span>
      <span className="text-[11px] text-muted-foreground">{meta}</span>
    </label>
  );

  const freeCourses = courses.filter((c) => !assignedIds.has(c.id));
  const freeDocs = documents.filter((d) => !assignedIds.has(d.id));

  return (
    <Dialog open={!!employee} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">{t.assign.title(employee?.full_name ?? "")}</DialogTitle>
        </DialogHeader>

        <div>
          <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{t.assign.current}</div>
          {current.length === 0 && <p className="text-[12px] text-muted-foreground">{t.assign.none}</p>}
          <div className="space-y-2">
            {current.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-xl bg-muted px-3 py-2">
                <span className="w-16 text-[10px] font-semibold uppercase text-primary">{a.course ? t.common.course : t.common.doc}</span>
                <span className="flex-1 text-[13px]">{a.course?.title ?? a.document?.title}</span>
                <span className="text-[11px] text-muted-foreground">{a.progress >= 100 ? t.common.done : `${a.progress}%`}</span>
                <input
                  type="date"
                  defaultValue={a.due_date ?? ""}
                  onBlur={(e) => e.target.value !== (a.due_date ?? "") && updateDue.mutate({ id: a.id, date: e.target.value })}
                  className="rounded-lg bg-card px-2 py-1 text-[11px] ring-1 ring-border"
                  aria-label={t.assign.dueDate}
                  title={dueLabel(a.due_date, lang)}
                />
                <button type="button" onClick={() => remove.mutate(a.id)} className="text-[11px] font-semibold text-destructive">
                  {t.assign.remove}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{t.assign.addCourses}</div>
            <div className="space-y-2">
              {freeCourses.map((c) => option(`course:${c.id}`, c.title, `${c.minutes} min`))}
              {freeCourses.length === 0 && <p className="text-[12px] text-muted-foreground">{t.assign.allCourses}</p>}
            </div>
          </div>
          <div>
            <div className="mb-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{t.assign.addDocuments}</div>
            <div className="space-y-2">
              {freeDocs.map((d) => option(`document:${d.id}`, d.title, `${d.pages} p`))}
              {freeDocs.length === 0 && <p className="text-[12px] text-muted-foreground">{t.assign.allDocuments}</p>}
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <label className="text-[12px] font-medium text-muted-foreground">
            {t.assign.dueDate}{" "}
            <input type="date" value={due} onChange={(e) => setDue(e.target.value)} className="ml-2 rounded-lg bg-card px-2 py-1.5 text-[12px] ring-1 ring-border" />
          </label>
          <button
            type="button"
            disabled={selected.size === 0 || assign.isPending}
            onClick={() => assign.mutate()}
            className="ml-auto rounded-xl bg-primary px-5 py-2 text-[13px] font-semibold text-primary-foreground shadow-primary transition hover:opacity-90 disabled:opacity-50"
          >
            {t.assign.button(selected.size)}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
