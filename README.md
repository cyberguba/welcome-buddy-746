# Postimees sisseelamine

Onboarding app for new Postimees Grupp employees: each person sees the documents to read or sign and the courses to complete, with due dates and progress. Managers follow their team; HR manages the course and document library, assignments and roles.

## Stack

- Vite, React 19, TypeScript, Tailwind CSS 4
- TanStack Router (file-based routes in `src/routes/`) and TanStack Query
- Supabase (PostgreSQL with row-level security, file storage for PDFs)
- Hosted on Azure Static Web Apps as a static single-page app

## Getting started

Requires Node.js 22.

```sh
npm ci
cp .env.example .env   # fill in the Supabase URL and publishable key
npm run dev
```

| Command           | What it does                      |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start the dev server              |
| `npm run build`   | Build the static app into `dist/` |
| `npm run preview` | Serve the built app locally       |
| `npm test`        | Run the Vitest tests              |
| `npm run lint`    | Lint and check formatting         |
| `npm run format`  | Format the code with Prettier     |

## Deployment

Pushing to `main` deploys to production through `.github/workflows/azure-static-web-apps-lemon-pond-070bbd203.yml`; every pull request gets its own preview URL. The workflow runs lint and tests first and needs the GitHub secrets `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` and `AZURE_STATIC_WEB_APPS_API_TOKEN_LEMON_POND_070BBD203`.

## Status

The app runs in a temporary **demo mode**: there is no sign-in, and anyone with the URL can read and change the data. Don't store real employee data until real authentication replaces it.

See `AGENTS.md` for the code layout and `SOFTWARE_RULES.md` for the engineering rules.
