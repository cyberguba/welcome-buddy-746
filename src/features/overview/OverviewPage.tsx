import { useT } from "@/shared/i18n";
import { SectionLinkCard } from "@/shared/components/SectionLinkCard";
import { calculatePercent, isAssignmentComplete } from "@/shared/lib/assignments";
import { getFirstName } from "@/shared/lib/format";
import { CONTACTS } from "@/features/contacts/contacts";
import { useAuth } from "@/features/auth/use-auth";
import { useMyAssignments } from "@/features/assignments/use-my-assignments";
import { WelcomeCard } from "./components/WelcomeCard";
import { NextUpCard } from "./components/NextUpCard";

const CONTACT_TEAMS_PREVIEW_COUNT = 3;

export function OverviewPage() {
  const { profile } = useAuth();
  const { t, lang } = useT();
  const { assignments, summary } = useMyAssignments();
  const nextDocument = assignments.find(
    (assignment) => assignment.document && !isAssignmentComplete(assignment),
  );
  const nextCourse = assignments.find(
    (assignment) => assignment.course && !isAssignmentComplete(assignment),
  );
  const previewTeams = CONTACTS.slice(0, CONTACT_TEAMS_PREVIEW_COUNT)
    .map((contact) => contact.team[lang])
    .join(", ");

  return (
    <>
      <section className="mt-7 grid gap-6 lg:grid-cols-[1.55fr_1fr]">
        <WelcomeCard
          firstName={(profile && getFirstName(profile.full_name)) || t.overview.there}
          summary={summary}
          continueTo={nextDocument ? "/documents" : "/courses"}
        />
        <NextUpCard
          nextDocument={nextDocument}
          nextCourse={nextCourse}
          hasAssignments={summary.totalCount > 0}
        />
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-3">
        <SectionLinkCard
          title={t.nav.documents}
          meta={t.common.completedOf(summary.documentsDone, summary.documentsTotal)}
          percent={calculatePercent(summary.documentsDone, summary.documentsTotal)}
          to="/documents"
          callToAction={t.overview.openDocuments}
        />
        <SectionLinkCard
          title={t.nav.courses}
          meta={t.common.completedOf(summary.coursesDone, summary.coursesTotal)}
          percent={calculatePercent(summary.coursesDone, summary.coursesTotal)}
          to="/courses"
          callToAction={t.overview.openCourses}
        />
        <SectionLinkCard
          title={t.nav.contacts}
          meta={t.overview.contactsMeta(CONTACTS.length, previewTeams)}
          to="/contacts"
          callToAction={t.overview.openContacts}
        />
      </section>
    </>
  );
}
