import { defineConfig } from "vitest/config";

// Separate from vite.config.ts: tests need only the "@/" alias, not the router/React/Tailwind build plugins.
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    include: ["src/tests/**/*.test.ts"],
    environment: "node",
  },
});
