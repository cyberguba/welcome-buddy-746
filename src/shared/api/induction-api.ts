import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export type AppRole = "hr" | "manager" | "employee";
export type Course = Tables<"courses">;
export type InductionDocument = Tables<"documents">;
export type Profile = Tables<"profiles">;
export type Assignment = Tables<"assignments"> & {
  course: Course | null;
  document: InductionDocument | null;
};

/** Purpose: all reads/writes to Lovable Cloud for the induction tool. Access is enforced by row-level security. */
export const profileQuery = (userId: string) =>
  queryOptions({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const [{ data: profile, error }, { data: roles, error: rErr }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", userId),
      ]);
      if (error) throw error;
      if (rErr) throw rErr;
      return { profile, roles: (roles ?? []).map((row) => row.role as AppRole) };
    },
  });

export const coursesQuery = queryOptions({
  queryKey: ["courses"],
  queryFn: async () => {
    const { data, error } = await supabase.from("courses").select("*").order("created_at");
    if (error) throw error;
    return data;
  },
});

export const documentsQuery = queryOptions({
  queryKey: ["documents"],
  queryFn: async () => {
    const { data, error } = await supabase.from("documents").select("*").order("created_at");
    if (error) throw error;
    return data;
  },
});

export const profilesQuery = queryOptions({
  queryKey: ["profiles"],
  queryFn: async () => {
    const { data, error } = await supabase.from("profiles").select("*").order("full_name");
    if (error) throw error;
    return data;
  },
});

export const rolesQuery = queryOptions({
  queryKey: ["roles"],
  queryFn: async () => {
    const { data, error } = await supabase.from("user_roles").select("user_id, role");
    if (error) throw error;
    const rolesByUser: Record<string, AppRole[]> = {};
    for (const row of data) (rolesByUser[row.user_id] ??= []).push(row.role as AppRole);
    return rolesByUser;
  },
});

/** userId given: that user's list. Omitted: every row the viewer may see (HR: all, manager: team). */
export const assignmentsQuery = (userId?: string) =>
  queryOptions({
    queryKey: ["assignments", userId ?? "visible"],
    queryFn: async () => {
      let query = supabase.from("assignments").select("*, course:courses(*), document:documents(*)").order("due_date", { nullsFirst: false });
      if (userId) query = query.eq("user_id", userId);
      const { data, error } = await query;
      if (error) throw error;
      return data as Assignment[];
    },
  });

/** Uploads a PDF to storage and returns its stored path. */
export async function uploadDocumentPdf(file: File) {
  const path = `${crypto.randomUUID()}.pdf`;
  const { error } = await supabase.storage.from("documents").upload(path, file, { contentType: "application/pdf" });
  if (error) throw error;
  return path;
}

export const documentFileUrlQuery = (path: string) =>
  queryOptions({
    queryKey: ["document-file", path],
    staleTime: 50 * 60 * 1000,
    queryFn: async () => {
      const { data, error } = await supabase.storage.from("documents").createSignedUrl(path, 3600);
      if (error) throw error;
      return data.signedUrl;
    },
  });

/** Counts finished items overall and per type (documents / courses). */
export function summarize(list: Assignment[]) {
  const done = list.filter((a) => a.progress >= 100).length;
  const docs = list.filter((a) => a.document_id);
  const courses = list.filter((a) => a.course_id);
  return {
    done,
    total: list.length,
    pct: list.length ? Math.round((done / list.length) * 100) : 0,
    documentsDone: docs.filter((a) => a.progress >= 100).length,
    documentsTotal: docs.length,
    coursesDone: courses.filter((a) => a.progress >= 100).length,
    coursesTotal: courses.length,
  };
}
