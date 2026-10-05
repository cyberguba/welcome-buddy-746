import cultureImage from "@/assets/course-culture.jpg";
import securityImage from "@/assets/course-security.jpg";
import toolsImage from "@/assets/course-tools.jpg";
import safetyImage from "@/assets/course-safety.jpg";

export const COURSE_IMAGE_KEYS = ["culture", "security", "tools", "safety"] as const;
export type CourseImageKey = (typeof COURSE_IMAGE_KEYS)[number];
export const DEFAULT_COURSE_IMAGE_KEY: CourseImageKey = "culture";

const COURSE_IMAGES: Record<CourseImageKey, string> = {
  culture: cultureImage,
  security: securityImage,
  tools: toolsImage,
  safety: safetyImage,
};

function isCourseImageKey(key: string): key is CourseImageKey {
  return (COURSE_IMAGE_KEYS as readonly string[]).includes(key);
}

/** Unknown or missing keys fall back to the default picture. */
export function getCourseImage(key: string | null): string {
  return COURSE_IMAGES[key && isCourseImageKey(key) ? key : DEFAULT_COURSE_IMAGE_KEY];
}
