import { createContext } from "react";
import type { AppRole, Profile } from "@/shared/api/types";

export interface AuthValue {
  userId: string;
  profile: Profile | null;
  roles: AppRole[];
  isHr: boolean;
  isManager: boolean;
  setViewAs: (userId: string) => void;
}

export const AuthContext = createContext<AuthValue | null>(null);
