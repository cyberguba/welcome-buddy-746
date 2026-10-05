import { createFileRoute, redirect } from "@tanstack/react-router";

// DEMO MODE: sign-in is switched off; send visitors to the overview.
export const Route = createFileRoute("/auth")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
