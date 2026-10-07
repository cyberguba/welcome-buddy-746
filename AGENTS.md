> [!IMPORTANT]
> Don't rewrite published git history (force push, or rebase/amend/squash of pushed commits).
> Work on a branch and open a pull request; `main` deploys to production on Azure.

## Project structure

Follows `SOFTWARE_RULES.md` (read it before changing code): code grouped by topic.

- Stack: Vite + React 19 + TanStack Router (file routes) + TanStack Query + Tailwind 4, built as a static single-page app. No server code. Why: Azure Static Web Apps serves static files, and all data goes browser → Supabase.
- `index.html` + `src/main.tsx` start the app; `src/router.tsx` creates the router and query client.
- `src/routes/` holds thin route files only (path, search-param validation, head meta); the router plugin generates `src/routeTree.gen.ts` from them (don't edit it).
- `src/features/<topic>/` (auth, assignments, overview, documents, courses, contacts, plan, admin) holds that topic's page, `components/` and `hooks/`. Why: one folder to change per feature.
- `src/shared/` holds cross-feature code: `components/`, `layout/` (shell, 404 and error pages), `api/`, `lib/`, `types/`, `i18n/`.
- `src/shared/api/`: one module per table (`courses`, `documents`, `profiles`, `assignments`) with react-query options and write functions; `columns.ts` (explicit select lists, no `select *`), `query-keys.ts`, `validation.ts` (zod schemas, PDF checks), `types.ts`. Components never call Supabase directly. Why: one place per table, validated input.
- `src/shared/lib/`: pure helpers — `assignments.ts` (progress/status rules), `dates.ts`, `format.ts`, `roles.ts`, `course-images.ts`, `storage.ts` (safe localStorage), `logger.ts`, `data-errors.ts`.
- `src/integrations/supabase/`: `client.ts` (the one Supabase client) and `types.ts` (generated database types, excluded from lint/prettier).
- Errors: every failed query/mutation goes through `reportDataError` via the QueryCache/MutationCache in `src/router.tsx` — logged with context, user sees a translated toast, never the raw DB message. Don't add per-mutation `onError` toasts. Render errors show `shared/layout/ErrorPage`.
- Telemetry: `shared/lib/telemetry.ts` sends page views (from the router, path only), `logger.error` exceptions (message only) and Supabase call timings to Azure Application Insights when `VITE_APPINSIGHTS_CONNECTION_STRING` is set (GitHub secret; empty locally). No cookies; query strings are stripped from every URL. The SDK is lazy-loaded in its own `telemetry` chunk. Why: see errors and usage without sending user ids or query details.
- `src/components/ui` (shadcn; only dialog, dropdown-menu, sonner are kept — add others with the shadcn CLI when needed), `src/hooks/use-mobile` and `src/lib/utils` stay at the paths shadcn expects; `src/components/ui` is excluded from lint/prettier.
- Sizing: use rem (e.g. `text-[0.8125rem]`), not px, for text, spacing and widths. `src/styles.css` scales the root font size up on screens ≥1536px, so px values would not grow with the rest. Why: the UI was too small on large screens (issue #4).
- Naming: descriptive names, verbs for functions, `is/has/should` for booleans, UPPER_SNAKE_CASE constants.
- Tests: Vitest, in `src/tests/` mirroring `src/` paths (`npm test`). The Azure workflow runs lint and tests before building. Business rules in `shared/lib` and `shared/api` need tests.
- Data: courses, documents, assignments, profiles and user_roles live in a Supabase project hosted by Lovable Cloud (kept after leaving the Lovable editor). The browser reads them via `src/shared/api/*`, and RLS enforces access. `supabase/migrations/` is the schema history; schema changes still have to be applied through Lovable Cloud until the database moves to a Supabase account we control. Why: roles are enforced server-side without extra server functions.
- Roles: `hr`, `manager`, `employee` in the `user_roles` table; the first account to sign up becomes HR. Managers see only people whose `profiles.manager_id` points to them. Why: this stops users from giving themselves more access.
- Auth: TEMPORARY demo mode — no sign-in; header "Viewing as" picker (`shared/layout/ViewAsPicker`) sets the current person (`features/auth/AuthProvider`, localStorage). Open anon access comes from migration 0001_demo_mode_open_access. Why: user wanted to try it without sign-in; remove before real use. This knowingly breaks the SOFTWARE_RULES "authorization server-side" rule until then.
- Languages: Estonian is default, English optional; all UI text lives in `src/shared/i18n/{et,en}.ts` and is read with `useT()`. Why: one place to edit translations, English must match Estonian keys (the `Dict` type enforces it).
- Azure: `npm run build` writes `dist/`; `public/staticwebapp.config.json` routes every path to `index.html`; `.github/workflows/azure-static-web-apps-lemon-pond-070bbd203.yml` (created by Azure, token secret is Azure's) deploys `main` and builds a preview per pull request. `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` come from GitHub secrets.
