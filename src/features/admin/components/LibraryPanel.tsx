import { useT } from "@/shared/i18n";
import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { coursesQuery, documentsQuery, uploadDocumentPdf } from "@/shared/api/induction-api";
import { COURSE_IMAGE_KEYS } from "@/shared/lib/format";

const field = "w-full rounded-lg bg-card/80 px-3 py-2 text-[13px] ring-1 ring-border outline-none focus:ring-2 focus:ring-primary";

export function LibraryPanel() {
  const qc = useQueryClient();
  const { t } = useT();
  const { data: courses = [] } = useQuery(coursesQuery);
  const { data: documents = [] } = useQuery(documentsQuery);

  const [course, setCourse] = useState({ title: "", category: t.library.defaultCategory, minutes: 15, description: "", image_key: "culture" });
  const [doc, setDoc] = useState({ title: "", description: "", pages: 1, requires_signature: true });
  const [pdf, setPdf] = useState<File | null>(null);
  const [fileKey, setFileKey] = useState(0);

  const addCourse = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("courses").insert(course);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t.library.courseAdded);
      setCourse({ ...course, title: "", description: "" });
      qc.invalidateQueries({ queryKey: ["courses"] });
    },
    onError: (error: Error) => {
      console.error("Induction data update failed", error);
      toast.error(error.message);
    },
  });

  const addDoc = useMutation({
    mutationFn: async () => {
      const file_path = pdf ? await uploadDocumentPdf(pdf) : null;
      const { error } = await supabase.from("documents").insert({ ...doc, file_path });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t.library.documentAdded);
      setDoc({ ...doc, title: "", description: "" });
      setPdf(null);
      setFileKey((k) => k + 1);
      qc.invalidateQueries({ queryKey: ["documents"] });
    },
    onError: (error: Error) => {
      console.error("Induction data update failed", error);
      toast.error(error.message);
    },
  });

  const attachPdf = useMutation({
    mutationFn: async ({ id, file }: { id: string; file: File }) => {
      const file_path = await uploadDocumentPdf(file);
      const { error } = await supabase.from("documents").update({ file_path }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success(t.library.pdfAttached);
      qc.invalidateQueries();
    },
    onError: (error: Error) => {
      console.error("Induction data update failed", error);
      toast.error(error.message);
    },
  });

  const remove = useMutation({
    mutationFn: async ({ table, id }: { table: "courses" | "documents"; id: string }) => {
      const { error } = await supabase.from(table).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries(),
    onError: (error: Error) => {
      console.error("Induction data update failed", error);
      toast.error(error.message);
    },
  });

  const onCourse = (e: FormEvent) => {
    e.preventDefault();
    addCourse.mutate();
  };
  const onDoc = (e: FormEvent) => {
    e.preventDefault();
    addDoc.mutate();
  };

  const row = (id: string, title: string, meta: string, table: "courses" | "documents") => (
    <div key={id} className="flex items-center gap-3 rounded-xl bg-card/70 px-3 py-2 ring-1 ring-border">
      <span className="flex-1 text-[13px] font-medium">{title}</span>
      <span className="text-[11px] text-muted-foreground">{meta}</span>
      <button
        type="button"
        onClick={() => confirm(t.library.confirmDelete(title)) && remove.mutate({ table, id })}
        className="text-[11px] font-semibold text-destructive"
      >
        {t.library.delete}
      </button>
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="glass rounded-2xl p-5">
        <h3 className="font-display text-[15px] font-bold">{t.library.courses}</h3>
        <div className="mt-3 space-y-2">{courses.map((c) => row(c.id, c.title, `${c.category} · ${c.minutes} min`, "courses"))}</div>
        <form onSubmit={onCourse} className="mt-5 space-y-2 border-t border-border pt-4">
          <div className="text-[12px] font-semibold text-muted-foreground">{t.library.newCourse}</div>
          <input className={field} placeholder={t.library.titlePh} value={course.title} onChange={(e) => setCourse({ ...course, title: e.target.value })} required />
          <textarea className={field} placeholder={t.library.descPh} rows={2} value={course.description} onChange={(e) => setCourse({ ...course, description: e.target.value })} />
          <div className="grid grid-cols-3 gap-2">
            <input className={field} placeholder={t.library.categoryPh} value={course.category} onChange={(e) => setCourse({ ...course, category: e.target.value })} required />
            <input className={field} type="number" min={1} value={course.minutes} onChange={(e) => setCourse({ ...course, minutes: Number(e.target.value) })} aria-label={t.library.minutes} />
            <select className={field} value={course.image_key} onChange={(e) => setCourse({ ...course, image_key: e.target.value })} aria-label={t.library.picture}>
              {COURSE_IMAGE_KEYS.map((k) => (
                <option key={k} value={k}>
                  {t.library.pictureOpt(k)}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" disabled={addCourse.isPending} className="rounded-lg bg-primary px-4 py-2 text-[12px] font-semibold text-primary-foreground">
            {t.library.addCourse}
          </button>
        </form>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="font-display text-[15px] font-bold">{t.library.documents}</h3>
        <div className="mt-3 space-y-2">
          {documents.map((d) => (
            <div key={d.id} className="space-y-1">
              {row(d.id, d.title, `${d.pages} p · ${d.requires_signature ? t.library.sign : t.library.read}`, "documents")}
              <label className="ml-3 inline-flex cursor-pointer items-center gap-1 text-[11px] font-semibold text-primary">
                {d.file_path ? t.library.replacePdf : t.library.attachPdf}
                <input
                  type="file"
                  accept="application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) attachPdf.mutate({ id: d.id, file });
                    e.target.value = "";
                  }}
                />
              </label>
            </div>
          ))}
        </div>
        <form onSubmit={onDoc} className="mt-5 space-y-2 border-t border-border pt-4">
          <div className="text-[12px] font-semibold text-muted-foreground">{t.library.newDocument}</div>
          <input className={field} placeholder={t.library.titlePh} value={doc.title} onChange={(e) => setDoc({ ...doc, title: e.target.value })} required />
          <textarea className={field} placeholder={t.library.descPh} rows={2} value={doc.description} onChange={(e) => setDoc({ ...doc, description: e.target.value })} />
          <input key={fileKey} className={field} type="file" accept="application/pdf" aria-label={t.library.pdfFile} onChange={(e) => setPdf(e.target.files?.[0] ?? null)} />
          <div className="flex items-center gap-3">
            <input className={field + " w-24"} type="number" min={1} value={doc.pages} onChange={(e) => setDoc({ ...doc, pages: Number(e.target.value) })} aria-label={t.library.pages} />
            <label className="flex items-center gap-2 text-[12px]">
              <input type="checkbox" className="accent-primary" checked={doc.requires_signature} onChange={(e) => setDoc({ ...doc, requires_signature: e.target.checked })} />
              {t.library.needsSignature}
            </label>
          </div>
          <button type="submit" disabled={addDoc.isPending} className="rounded-lg bg-primary px-4 py-2 text-[12px] font-semibold text-primary-foreground">
            {t.library.addDocument}
          </button>
        </form>
      </div>
    </div>
  );
}
