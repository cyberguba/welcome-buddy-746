import { useEffect, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { profileWithRolesQuery } from "@/shared/api/profiles";
import { uuidSchema } from "@/shared/api/validation";
import { readStoredValue, writeStoredValue } from "@/shared/lib/storage";
import { AuthContext } from "./auth-context";

/**
 * Purpose: holds who the app is "viewing as" and that person's roles.
 * Constraints: TEMPORARY DEMO MODE — there is no sign-in; the visitor picks a person in the header.
 * Real access control lives in row-level security; replace this with real auth before going live.
 */
const DEMO_HR_USER_ID = "00000000-0000-0000-0000-000000000001";
const VIEW_AS_STORAGE_KEY = "postimees-view-as";

function readStoredViewAs(): string | null {
  const storedUserId = readStoredValue(VIEW_AS_STORAGE_KEY);
  return uuidSchema.safeParse(storedUserId).success ? storedUserId : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState(DEMO_HR_USER_ID);
  const [isStorageRead, setIsStorageRead] = useState(false);
  const queryClient = useQueryClient();

  // Read storage after mount so the server-rendered shell and first client render match.
  useEffect(() => {
    const storedUserId = readStoredViewAs();
    if (storedUserId) setUserId(storedUserId);
    setIsStorageRead(true);
  }, []);

  const setViewAs = (nextUserId: string) => {
    writeStoredValue(VIEW_AS_STORAGE_KEY, nextUserId);
    setUserId(nextUserId);
    queryClient.invalidateQueries();
  };

  const { data } = useQuery({ ...profileWithRolesQuery(userId), enabled: isStorageRead });
  const roles = data?.roles ?? [];

  return (
    <AuthContext.Provider
      value={{
        userId,
        profile: data?.profile ?? null,
        roles,
        isHr: roles.includes("hr"),
        isManager: roles.includes("manager"),
        setViewAs,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
