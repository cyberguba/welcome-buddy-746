<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Project structure
Follows `SOFTWARE_RULES.md` (read it before changing code): code grouped by topic.
- `src/routes/` holds thin route files only (path, search-param validation, head meta); TanStack file routing requires them there.
- `src/features/<topic>/` (auth, assignments, overview, documents, courses, contacts, plan, admin) holds that topic's page, `components/` and `hooks/`. Why: one folder to change per feature.
- `src/shared/` holds cross-feature code: `components/`, `layout/` (shell rendered once in `__root.tsx`), `api/`, `lib/`, `types/`, `i18n/`.
- `src/shared/api/`: one module per table (`courses`, `documents`, `profiles`, `assignments`) with react-query options and write functions; `columns.ts` (explicit select lists, no `select *`), `query-keys.ts`, `validation.ts` (zod schemas, PDF checks), `types.ts`. Components never call Supabase directly. Why: one place per table, validated input.
- `src/shared/lib/`: pure helpers — `assignments.ts` (progress/status rules), `dates.ts`, `format.ts`, `roles.ts`, `course-images.ts`, `storage.ts` (safe localStorage), `logger.ts`, `data-errors.ts`.
- Errors: every failed query/mutation goes through `reportDataError` via the QueryCache/MutationCache in `src/router.tsx` — logged with context, user sees a translated toast, never the raw DB message. Don't add per-mutation `onError` toasts.
- `src/components/ui`, `src/integrations`, `src/hooks/use-mobile`, `src/lib/utils` stay put because shadcn/Lovable expect those paths; `src/components/ui` and `src/integrations` are generated, so they're excluded from lint/prettier. `src/lib/error-*` is template error handling.
- Sizing: use rem (e.g. `text-[0.8125rem]`), not px, for text, spacing and widths. `src/styles.css` scales the root font size up on screens ≥1536px, so px values would not grow with the rest. Why: the UI was too small on large screens (issue #4).
- Naming: descriptive names, verbs for functions, `is/has/should` for booleans, UPPER_SNAKE_CASE constants.
- Tests: Vitest, in `src/tests/` mirroring `src/` paths (`npm test`); `vitest.config.ts` is separate from the Lovable vite config. The Azure workflow runs lint and tests before building. Business rules in `shared/lib` and `shared/api` need tests.
- Data: courses, documents, assignments, profiles and user_roles live in Lovable Cloud; the browser reads them via `src/shared/api/*`, and RLS enforces access. Why: roles are enforced server-side without extra server functions.
- Roles: `hr`, `manager`, `employee` in the `user_roles` table; the first account to sign up becomes HR. Managers see only people whose `profiles.manager_id` points to them. Why: this stops users from giving themselves more access.
- Auth: TEMPORARY demo mode — no sign-in; header "Viewing as" picker (`shared/layout/ViewAsPicker`) sets the current person (`features/auth/AuthProvider`, localStorage). Open anon access comes from migration 0001_demo_mode_open_access. Why: user wanted to try it without sign-in; remove before real use. This knowingly breaks the SOFTWARE_RULES "authorization server-side" rule until then.
- Languages: Estonian is default, English optional; all UI text lives in `src/shared/i18n/{et,en}.ts` and is read with `useT()`. Why: one place to edit translations, English must match Estonian keys (the `Dict` type enforces it).
- Azure: `npm run build:azure` (BUILD_TARGET=azure-swa) builds a static SPA into `dist/client` with `public/staticwebapp.config.json` routing every path to `index.html`; `.github/workflows/azure-static-web-apps-lemon-pond-070bbd203.yml` (created by Azure, token secret is Azure's) deploys it. Plain `npm run build` stays the Lovable/Cloudflare SSR build. Why: SWA serves static files only, and no server functions are used.
