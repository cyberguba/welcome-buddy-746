import { CourseLibrary } from "./CourseLibrary";
import { DocumentLibrary } from "./DocumentLibrary";

export function LibraryPanel() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <CourseLibrary />
      <DocumentLibrary />
    </div>
  );
}
