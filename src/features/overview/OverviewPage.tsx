import { useT } from "@/shared/i18n";
import { Link } from "@tanstack/react-router";
import { ProgressBar } from "@/shared/components/ProgressBar";
import { SectionLinkCard } from "@/shared/components/SectionLinkCard";
import { CONTACTS } from "@/features/contacts/contacts";
import { useAuth } from "@/features/auth/use-auth";
import { useMyAssignments } from "@/features/assignments/use-my-assignments";
import { courseLabel, dueLabel } from "@/shared/lib/format";

const pctOf = (done: number, total: number) => (total ? Math.round((done / total) * 100) : 0);

export function OverviewPage() {
  const { profile } = useAuth();
  const { t, lang } = useT();
  const { list, totals } = useMyAssignments();
  const nextDocument = list.find((a) => a.document && a.progress < 100);
  const nextCourse = list.find((a) => a.course && a.progress < 100);
  const teams = CONTACTS.slice(0, 3)
    .map((c) => c.team[lang])
    .join(", ");
  const firstName = profile?.full_name.split(" ")[0] || t.overview.there;

  return (
    <>
      <section className="mt-7 grid gap-6 lg:grid-cols-[1.55fr_1fr]">
        <div className="glass-strong animate-rise rounded-[28px] p-6">
          <div className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-foreground">
            {t.overview.welcome}
          </div>
          <h1 className="mt-3 font-display text-[28px] font-bold leading-[1.15] tracking-tight">
            {t.overview.title} <span className="text-primary">{firstName}.</span>
          </h1>
          <div className="mt-5 flex items-end justify-between">
            <div className="font-display text-[36px] font-extrabold leading-none text-primary">
              {totals.pct}%
            </div>
            <div className="text-[12px] font-medium text-muted-foreground">
              {t.overview.itemsDone(totals.done, totals.total)}
            </div>
          </div>
          <div className="mt-3">
            <ProgressBar pct={totals.pct} gradient />
          </div>
          <Link
            to={nextDocument ? "/documents" : "/courses"}
            className="mt-5 inline-block rounded-xl bg-primary px-5 py-2.5 text-[13px] font-semibold text-primary-foreground shadow-primary transition hover:opacity-90"
          >
            {t.overview.continue}
          </Link>
          <Link
            to="/plan"
            className="ml-3 inline-block text-[13px] font-semibold text-primary hover:underline"
          >
            {t.overview.fullPlan}
          </Link>
        </div>

        <div className="glass-strong animate-rise rounded-[28px] p-6 [animation-delay:80ms]">
          <div className="font-display text-[15px] font-bold">{t.overview.nextUp}</div>
          <div className="mt-4 space-y-3">
            {nextDocument?.document && (
              <Link
                to="/documents"
                className="block rounded-2xl bg-card/70 p-4 ring-1 ring-border transition hover:ring-primary/30"
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-warning">
                  {t.common.document} · {dueLabel(nextDocument.due_date, lang)}
                </div>
                <div className="mt-1 text-[13px] font-semibold">{nextDocument.document.title}</div>
              </Link>
            )}
            {nextCourse?.course && (
              <Link
                to="/courses"
                className="block rounded-2xl bg-accent p-4 ring-1 ring-primary/25"
              >
                <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                  {t.common.course} · {dueLabel(nextCourse.due_date, lang)}
                </div>
                <div className="mt-1 text-[13px] font-semibold">{nextCourse.course.title}</div>
                <div className="mt-1 text-[11px] font-medium text-muted-foreground">
                  {courseLabel(nextCourse.progress, nextCourse.course.minutes, lang)}
                </div>
              </Link>
            )}
            {totals.total === 0 && (
              <div className="rounded-2xl bg-muted p-4 text-[13px] text-muted-foreground">
                {t.overview.nothing}
              </div>
            )}
            {totals.total > 0 && !nextCourse && !nextDocument && (
              <div className="rounded-2xl bg-success/15 p-4 text-[13px] font-semibold text-success">
                {t.overview.allDone}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <SectionLinkCard
          title={t.nav.documents}
          meta={t.common.completedOf(totals.documentsDone, totals.documentsTotal)}
          pct={pctOf(totals.documentsDone, totals.documentsTotal)}
          to="/documents"
          cta={t.overview.openDocuments}
        />
        <SectionLinkCard
          title={t.nav.courses}
          meta={t.common.completedOf(totals.coursesDone, totals.coursesTotal)}
          pct={pctOf(totals.coursesDone, totals.coursesTotal)}
          to="/courses"
          cta={t.overview.openCourses}
        />
        <SectionLinkCard
          title={t.nav.contacts}
          meta={t.overview.contactsMeta(CONTACTS.length, teams)}
          to="/contacts"
          cta={t.overview.openContacts}
        />
      </section>
    </>
  );
}
