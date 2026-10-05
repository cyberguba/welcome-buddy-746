// Explicit column lists so queries never use SELECT *. Keep in sync with the types in ./types.ts.
export const COURSE_COLUMNS = "id, title, category, description, minutes, image_key";
export const DOCUMENT_COLUMNS = "id, title, description, pages, requires_signature, file_path";
export const PROFILE_COLUMNS = "id, full_name, email, manager_id";
export const ASSIGNMENT_COLUMNS = `id, user_id, course_id, document_id, due_date, progress, course:courses(${COURSE_COLUMNS}), document:documents(${DOCUMENT_COLUMNS})`;
