import { defineConfig } from "vitest/config";

// Separate from vite.config.ts on purpose: tests need only the "@/" alias, not the Lovable/TanStack build plugins.
export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    include: ["src/tests/**/*.test.ts"],
    environment: "node",
  },
});
