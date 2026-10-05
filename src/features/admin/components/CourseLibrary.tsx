import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useT } from "@/shared/i18n";
import { coursesQuery } from "@/shared/api/courses";
import type { CourseInput } from "@/shared/api/validation";
import {
  COURSE_IMAGE_KEYS,
  DEFAULT_COURSE_IMAGE_KEY,
  type CourseImageKey,
} from "@/shared/lib/course-images";
import { useCreateCourse, useDeleteCourse } from "../hooks/use-library-mutations";
import { FORM_FIELD_CLASS, SUBMIT_BUTTON_CLASS } from "./form-styles";
import { LibraryItemRow } from "./LibraryItemRow";

const DEFAULT_COURSE_MINUTES = 15;

export function CourseLibrary() {
  const { t } = useT();
  const { data: courses = [] } = useQuery(coursesQuery);
  const createCourse = useCreateCourse();
  const deleteCourse = useDeleteCourse();
  const [courseForm, setCourseForm] = useState<CourseInput>({
    title: "",
    category: t.library.defaultCategory,
    minutes: DEFAULT_COURSE_MINUTES,
    description: "",
    image_key: DEFAULT_COURSE_IMAGE_KEY,
  });

  const updateCourseForm = (changes: Partial<CourseInput>) =>
    setCourseForm((current) => ({ ...current, ...changes }));

  const submitCourse = (event: FormEvent) => {
    event.preventDefault();
    createCourse.mutate(courseForm, {
      onSuccess: () => {
        toast.success(t.library.courseAdded);
        updateCourseForm({ title: "", description: "" });
      },
    });
  };

  return (
    <div className="glass rounded-2xl p-5">
      <h3 className="font-display text-[15px] font-bold">{t.library.courses}</h3>
      <div className="mt-3 space-y-2">
        {courses.map((course) => (
          <LibraryItemRow
            key={course.id}
            title={course.title}
            meta={`${course.category} · ${course.minutes} min`}
            isDeleting={deleteCourse.isPending && deleteCourse.variables === course.id}
            onDelete={() => deleteCourse.mutate(course.id)}
          />
        ))}
      </div>
      <form onSubmit={submitCourse} className="mt-5 space-y-2 border-t border-border pt-4">
        <div className="text-[12px] font-semibold text-muted-foreground">{t.library.newCourse}</div>
        <input
          className={FORM_FIELD_CLASS}
          placeholder={t.library.titlePh}
          aria-label={t.library.titlePh}
          value={courseForm.title}
          onChange={(event) => updateCourseForm({ title: event.target.value })}
          required
        />
        <textarea
          className={FORM_FIELD_CLASS}
          placeholder={t.library.descPh}
          aria-label={t.library.descPh}
          rows={2}
          value={courseForm.description}
          onChange={(event) => updateCourseForm({ description: event.target.value })}
        />
        <div className="grid grid-cols-3 gap-2">
          <input
            className={FORM_FIELD_CLASS}
            placeholder={t.library.categoryPh}
            aria-label={t.library.categoryPh}
            value={courseForm.category}
            onChange={(event) => updateCourseForm({ category: event.target.value })}
            required
          />
          <input
            className={FORM_FIELD_CLASS}
            type="number"
            min={1}
            value={courseForm.minutes}
            onChange={(event) => updateCourseForm({ minutes: Number(event.target.value) })}
            aria-label={t.library.minutes}
          />
          <select
            className={FORM_FIELD_CLASS}
            value={courseForm.image_key}
            onChange={(event) =>
              updateCourseForm({ image_key: event.target.value as CourseImageKey })
            }
            aria-label={t.library.picture}
          >
            {COURSE_IMAGE_KEYS.map((imageKey) => (
              <option key={imageKey} value={imageKey}>
                {t.library.pictureOpt(imageKey)}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={createCourse.isPending} className={SUBMIT_BUTTON_CLASS}>
          {t.library.addCourse}
        </button>
      </form>
    </div>
  );
}
