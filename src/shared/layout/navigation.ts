import type { AppRole } from "@/shared/api/induction-api";

export const NAV_ITEMS: {
  to: "/" | "/documents" | "/courses" | "/contacts" | "/plan" | "/team" | "/hr";
  key: "overview" | "plan" | "documents" | "courses" | "contacts" | "team" | "hr";
  role?: AppRole;
}[] = [
  { to: "/", key: "overview" },
  { to: "/plan", key: "plan" },
  { to: "/documents", key: "documents" },
  { to: "/courses", key: "courses" },
  { to: "/contacts", key: "contacts" },
  { to: "/team", key: "team", role: "manager" },
  { to: "/hr", key: "hr", role: "hr" },
];
