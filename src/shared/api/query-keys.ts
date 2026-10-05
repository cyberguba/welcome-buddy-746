// Single source of react-query cache keys, so reads and invalidations always match.
export const QUERY_KEYS = {
  courses: ["courses"],
  documents: ["documents"],
  profiles: ["profiles"],
  roles: ["roles"],
  assignments: ["assignments"],
  profile: (userId: string) => ["profile", userId],
  userAssignments: (userId: string) => ["assignments", userId],
  visibleAssignments: ["assignments", "visible"],
  documentFile: (path: string) => ["document-file", path],
} as const;
