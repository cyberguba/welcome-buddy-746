# Estonian as main language, English as option

## What you'll get
- The whole app opens in **Estonian** by default: menu, page titles, buttons, filters, status labels (Tehtud, Pooleli, Tähtaeg ületatud...), due dates ("Tähtaeg 5. okt"), empty states, HR admin, My team, My plan, contacts page, footer and toast messages.
- A small **ET / EN** switch in the header. The choice is remembered on that device.
- Page titles and descriptions shown in browser tabs follow the language too.
- Course and document titles/descriptions stay exactly as HR typed them in the library (not auto-translated). The example courses, documents and contacts get Estonian texts.

## Technical details
- Lightweight custom i18n: `src/i18n/{et.ts,en.ts}` dictionaries (typed, `en` must match `et` keys), `LanguageContext` + `useT()` hook, provider in `__root.tsx`.
- Language stored in localStorage, read in `useEffect` (default `et`) to avoid hydration mismatch; `<html lang>` updated.
- Replace hardcoded strings across `src/pages/*`, `src/components/{layout,common,documents,courses,contacts,plan,admin}/*`.
- `src/lib/format.ts` date/label helpers take the locale (`et-EE` / `en-GB`); plan week grouping labels translated.
- `ROLE_LABELS` and status filter labels moved to dictionaries (filter values stay internal).
- `src/data/contacts.ts`: bilingual role/hours/help fields.
- Route `head()` meta defaults to Estonian.
- Seed course/document texts updated to Estonian via a data migration (only the example rows).
- Language-switch component added to the Header next to "Viewing as".
