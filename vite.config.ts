import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

/**
 * Libraries get their own chunks, grouped by how often they change. An app release then only
 * changes the small app chunks, and browsers keep the cached library files (served with a
 * one-year immutable cache from /assets, see public/staticwebapp.config.json).
 * Higher priority wins when a module matches several groups.
 */
const LIBRARY_CHUNK_GROUPS = [
  // Loaded on demand after start-up (see shared/lib/telemetry.ts), so it must not join "vendor".
  {
    name: "telemetry",
    test: /node_modules[\\/](@microsoft|@nevware21)[\\/]/,
    priority: 5,
  },
  { name: "react", test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/, priority: 4 },
  { name: "supabase", test: /node_modules[\\/]@supabase[\\/]/, priority: 3 },
  { name: "tanstack", test: /node_modules[\\/]@tanstack[\\/]/, priority: 2 },
  { name: "vendor", test: /node_modules[\\/]/, priority: 1 },
];

// Static single-page app: `npm run build` writes dist/, which Azure Static Web Apps serves.
// The router plugin generates src/routeTree.gen.ts from src/routes/ and must run before React.
export default defineConfig({
  plugins: [tanstackRouter({ target: "react", autoCodeSplitting: true }), react(), tailwindcss()],
  resolve: { tsconfigPaths: true },
  build: {
    rolldownOptions: {
      output: { codeSplitting: { groups: LIBRARY_CHUNK_GROUPS } },
    },
  },
});
