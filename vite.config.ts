// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// `npm run build:azure` sets this. It builds a static SPA (no server) for Azure Static Web Apps.
// Why: SWA serves static files; all data goes browser -> Supabase, so no SSR server is needed.
// Lovable builds don't set it, so they keep the default SSR/Cloudflare output.
const IS_AZURE_SWA_BUILD = process.env["BUILD_TARGET"] === "azure-swa";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    ...(IS_AZURE_SWA_BUILD && {
      // Prerender one HTML shell; staticwebapp.config.json falls back to it for every route.
      spa: { enabled: true, prerender: { outputPath: "/index.html" } },
    }),
  },
  ...(IS_AZURE_SWA_BUILD && { nitro: false }),
});
