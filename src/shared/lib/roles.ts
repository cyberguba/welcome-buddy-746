import type { AppRole } from "@/shared/api/types";

/** Highest role first. */
export const ROLES_BY_RANK: AppRole[] = ["hr", "manager", "employee"];

/** The role shown next to a person's name: their highest one, employee if they have none. */
export function getPrimaryRole(roles: AppRole[]): AppRole {
  return ROLES_BY_RANK.find((role) => roles.includes(role)) ?? "employee";
}
