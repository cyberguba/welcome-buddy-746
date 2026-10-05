# Language picker as a compact dropdown

## What changes
- Remove the ET / EN pill from the header.
- Add a small globe button showing the current language code (e.g. "ET") next to the profile initials. Clicking it opens a dropdown with:
  - Eesti keel (checkmark when active)
  - English
- On narrow screens the header stays on one line: the "Viewing as" label text is hidden and only the person picker remains, so the globe button and initials fit.

## Technical details
- `src/components/layout/LanguageMenu.tsx`: shadcn `DropdownMenu` + lucide `Globe` / `Check` icons, uses `useT()`; labels in `src/i18n/{et,en}.ts` (`header.language`, language names).
- `Header.tsx`: replace the pill group with `<LanguageMenu />`; add `hidden sm:block` to the "Viewing as" caption.
