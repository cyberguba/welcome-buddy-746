# Compact Overview page

## What changes
The Overview page becomes a short dashboard: progress stays visible, and the full document and course cards move off it.

## New layout
1. **Welcome card** (kept, a bit smaller): greeting, overall progress %, progress bar, "X of Y items done", and a "Continue induction" button that goes to the next unfinished item.
2. **Three link tiles in a row**, each one clickable:
   - **Documents**: "2 of 5 completed", a small progress bar, and "Open documents".
   - **Courses**: "1 of 4 completed", a small progress bar, and "Open courses".
   - **Contacts**: "6 contacts: IT, HR, payroll..." and "Open contacts".
3. **Next up** (small card): the next pending document and next unfinished course, each linking to its page. It shows "All done" when everything is finished. It also has the buddy line.

Removed from Overview: the 3 document cards, the 3 course cards and the "View checklist" button. They all still work on their own pages.

## Technical details
- New `src/components/common/SectionLinkCard.tsx` with props: title, meta text, optional pct, `to` link, and CTA label. Built with the glass style and existing tokens.
- Rewrite `src/pages/OverviewPage.tsx` to use it. Tile counts come from `useInduction().totals`, `DOCUMENTS`, `COURSES` and `CONTACTS`.
- Stack the tiles on mobile and show 3 columns from `md` up.
