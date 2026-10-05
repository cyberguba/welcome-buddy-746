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
Follows the uploaded engineering rules (software_rules.md): code grouped by topic.
- `src/routes/` holds thin route files only (path + head meta); TanStack file routing requires them there.
- `src/features/<topic>/` (auth, assignments, overview, documents, courses, contacts, plan, admin) holds that topic's page, `components/` and hooks. Why: one folder to change per feature.
- `src/shared/` holds cross-feature code: `components/`, `layout/` (shell rendered once in `__root.tsx`), `api/induction-api.ts`, `lib/` (format, seo), `types/`, `i18n/`.
- `src/components/ui`, `src/hooks/use-mobile`, `src/lib/utils` stay put because shadcn expects those paths; `src/lib/error-*` is template error handling.
- Naming: descriptive names, verbs for functions, `is/has` for booleans, UPPER_SNAKE_CASE constants; data errors are logged and shown as a toast.
- Data: courses, documents, assignments, profiles and user_roles live in Lovable Cloud; the browser client reads them via react-query options in `src/lib/induction-api.ts`, and RLS enforces access. Why: roles are enforced server-side without extra server functions.
- Roles: `hr`, `manager`, `employee` in the `user_roles` table; the first account to sign up becomes HR. Managers see only people whose `profiles.manager_id` points to them. Why: this stops users from giving themselves more access.
- Auth: TEMPORARY demo mode — no sign-in; header "Viewing as" picker sets the current person (AuthContext, localStorage). Open anon access comes from migration 0001_demo_mode_open_access. Why: user wanted to try it without sign-in; remove before real use.
- Languages: Estonian is default, English optional; all UI text lives in `src/i18n/{et,en}.ts` and is read with `useT()`. Why: one place to edit translations, English must match Estonian keys.
- Azure: `npm run build:azure` (BUILD_TARGET=azure-swa) builds a static SPA into `dist/client` with `public/staticwebapp.config.json` routing every path to `index.html`; `.github/workflows/azure-static-web-apps-lemon-pond-070bbd203.yml` (created by Azure, token secret is Azure's) deploys it. Plain `npm run build` stays the Lovable/Cloudflare SSR build. Why: SWA serves static files only, and no server functions are used.
