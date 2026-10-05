import type { AppRole } from "@/shared/api/types";
import type { Dict } from "@/shared/i18n";

interface NavItem {
  to: "/" | "/documents" | "/courses" | "/contacts" | "/plan" | "/team" | "/hr";
  labelKey: keyof Dict["nav"];
  /** Hidden from people without this role. Row-level security still guards the data itself. */
  requiredRole?: AppRole;
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/", labelKey: "overview" },
  { to: "/plan", labelKey: "plan" },
  { to: "/documents", labelKey: "documents" },
  { to: "/courses", labelKey: "courses" },
  { to: "/contacts", labelKey: "contacts" },
  { to: "/team", labelKey: "team", requiredRole: "manager" },
  { to: "/hr", labelKey: "hr", requiredRole: "hr" },
];
