import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import { createAppRouter } from "./router";
import { initTelemetry, trackPageView } from "./shared/lib/telemetry";
import "./styles.css";

const router = createAppRouter();

const telemetryConnectionString = import.meta.env["VITE_APPINSIGHTS_CONNECTION_STRING"];
if (telemetryConnectionString) {
  void initTelemetry(telemetryConnectionString);
  router.subscribe("onResolved", ({ toLocation }) => trackPageView(toLocation.pathname));
}

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element #root is missing from index.html");

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
