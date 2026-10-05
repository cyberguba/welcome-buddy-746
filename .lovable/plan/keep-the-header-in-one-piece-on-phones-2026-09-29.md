# Keep the header in one piece on phones

## What changes
On a phone (about 390px wide) the logo, the "Viewing as" person picker, the globe button and the initials don't fit on one line, so the picker spills out of the header.

- The logo stays sharp and keeps its shape, just a bit smaller on phones.
- The person picker takes whatever space is left and shortens a long name with "…" so it stays inside the header.
- On phones the picker shows only the person's name. The role (e.g. "· HR") is hidden there and still shows on wider screens.
- The initials circle is hidden on phones, since the picker already shows who you're viewing as. It comes back on wider screens.
- The globe button stays visible everywhere.

## Technical details
- `Header.tsx`: header becomes `grid grid-cols-[auto_minmax(0,1fr)] md:flex` so the right-hand group can shrink. The right group gets `min-w-0 justify-end`, the label gets `min-w-0`, and the select becomes `w-full max-w-[170px] truncate`.
- Logo: `h-5 sm:h-7`, `shrink-0`, aspect ratio kept.
- Role suffix in the option text only from `sm` up (read with `useIsMobile`).
- Initials: `hidden sm:grid`.
- Check at 393px and at 1280px with Playwright screenshots.
