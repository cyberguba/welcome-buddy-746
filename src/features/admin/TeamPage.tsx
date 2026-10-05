import { useT } from "@/shared/i18n";
import { useQuery } from "@tanstack/react-query";
import { SectionHeader } from "@/shared/components/SectionHeader";
import { EmptyState } from "@/shared/components/EmptyState";
import { ProgressTable } from "@/features/admin/components/ProgressTable";
import { assignmentsQuery, profilesQuery } from "@/shared/api/induction-api";
import { useAuth } from "@/features/auth/use-auth";

export function TeamPage() {
  const { isManager, userId, profile } = useAuth();
  const { data: people = [] } = useQuery({ ...profilesQuery, enabled: isManager });
  const { data: assignments = [] } = useQuery({ ...assignmentsQuery(), enabled: isManager });
  const { t } = useT();
  const team = people.filter((p) => p.manager_id === userId);

  if (!profile) return null;
  if (!isManager) return <EmptyState message={t.team.onlyManagers} />;

  return (
    <section className="mt-7">
      <SectionHeader title={t.nav.team} meta={t.common.people(team.length)} />
      <ProgressTable people={team} assignments={assignments} emptyMessage={t.team.empty} />
    </section>
  );
}
