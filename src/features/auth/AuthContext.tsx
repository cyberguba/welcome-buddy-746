import { createContext, useEffect, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { profileQuery, type AppRole, type Profile } from "@/shared/api/induction-api";

/**
 * DEMO MODE: no sign-in. The visitor picks which person to "view as".
 * Default is the demo HR user. Replace with real auth before going live.
 */
export const DEMO_HR_ID = "00000000-0000-0000-0000-000000000001";
const STORAGE_KEY = "postimees-view-as";

export interface AuthValue {
  session: { demo: true } | null;
  ready: boolean;
  userId: string | null;
  profile: Profile | null;
  roles: AppRole[];
  isHr: boolean;
  isManager: boolean;
  setViewAs: (id: string) => void;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [userId, setUserId] = useState<string>(DEMO_HR_ID);
  const [ready, setReady] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setUserId(saved);
    setReady(true);
  }, []);

  const setViewAs = (id: string) => {
    window.localStorage.setItem(STORAGE_KEY, id);
    setUserId(id);
    queryClient.invalidateQueries();
  };

  const { data } = useQuery({ ...profileQuery(userId), enabled: ready });
  const roles = data?.roles ?? [];

  return (
    <AuthContext.Provider
      value={{
        session: { demo: true },
        ready,
        userId,
        profile: data?.profile ?? null,
        roles,
        isHr: roles.includes("hr"),
        isManager: roles.includes("manager"),
        setViewAs,
        signOut: async () => setViewAs(DEMO_HR_ID),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
