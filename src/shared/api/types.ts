import type { Database, Tables } from "@/integrations/supabase/types";

export type AppRole = Database["public"]["Enums"]["app_role"];

export type Course = Pick<
  Tables<"courses">,
  "id" | "title" | "category" | "description" | "minutes" | "image_key"
>;
export type InductionDocument = Pick<
  Tables<"documents">,
  "id" | "title" | "description" | "pages" | "requires_signature" | "file_path"
>;
export type Profile = Pick<Tables<"profiles">, "id" | "full_name" | "email" | "manager_id">;

export type Assignment = Pick<
  Tables<"assignments">,
  "id" | "user_id" | "course_id" | "document_id" | "due_date" | "progress"
> & {
  course: Course | null;
  document: InductionDocument | null;
};

export type RolesByUser = Record<string, AppRole[]>;
