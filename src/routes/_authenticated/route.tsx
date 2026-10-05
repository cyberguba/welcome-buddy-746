import { createFileRoute, Outlet } from "@tanstack/react-router";

// DEMO MODE: no sign-in gate. Restore the sign-in check before going live.
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: () => <Outlet />,
});
