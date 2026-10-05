import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { COURSE_COLUMNS } from "./columns";
import { QUERY_KEYS } from "./query-keys";
import { throwIfError, unwrapData } from "./unwrap";
import { courseInputSchema, parseInput, type CourseInput } from "./validation";

/** Purpose: reads and writes the course library. Only HR may write (row-level security). */
export const coursesQuery = queryOptions({
  queryKey: QUERY_KEYS.courses,
  queryFn: async () =>
    unwrapData(await supabase.from("courses").select(COURSE_COLUMNS).order("created_at")),
});

export async function createCourse(input: CourseInput) {
  const course = parseInput(courseInputSchema, input);
  throwIfError(await supabase.from("courses").insert(course));
}

export async function deleteCourse(courseId: string) {
  throwIfError(await supabase.from("courses").delete().eq("id", courseId));
}
