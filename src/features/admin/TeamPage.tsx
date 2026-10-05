import { useQuery } from "@tanstack/react-query";
import { useT } from "@/shared/i18n";
import { SectionHeader } from "@/shared/components/SectionHeader";
import { EmptyState } from "@/shared/components/EmptyState";
import { visibleAssignmentsQuery } from "@/shared/api/assignments";
import { profilesQuery } from "@/shared/api/profiles";
import { useAuth } from "@/features/auth/use-auth";
import { ProgressTable } from "./components/ProgressTable";

export function TeamPage() {
  const { isManager, userId, profile } = useAuth();
  const { t } = useT();
  const { data: people = [] } = useQuery({ ...profilesQuery, enabled: isManager });
  const { data: assignments = [] } = useQuery({ ...visibleAssignmentsQuery, enabled: isManager });
  const teamMembers = people.filter((person) => person.manager_id === userId);

  // The UI check only hides the page; row-level security is what actually restricts the data.
  if (!profile) return null;
  if (!isManager) return <EmptyState message={t.team.onlyManagers} />;

  return (
    <section className="mt-7">
      <SectionHeader title={t.nav.team} meta={t.common.people(teamMembers.length)} />
      <ProgressTable people={teamMembers} assignments={assignments} emptyMessage={t.team.empty} />
    </section>
  );
}
