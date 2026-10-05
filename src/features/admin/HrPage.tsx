import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useT } from "@/shared/i18n";
import { SectionHeader } from "@/shared/components/SectionHeader";
import { EmptyState } from "@/shared/components/EmptyState";
import { PillToggleGroup } from "@/shared/components/PillToggleGroup";
import { visibleAssignmentsQuery } from "@/shared/api/assignments";
import { profilesQuery } from "@/shared/api/profiles";
import { useAuth } from "@/features/auth/use-auth";
import { ProgressTable } from "./components/ProgressTable";
import { LibraryPanel } from "./components/LibraryPanel";
import { PeoplePanel } from "./components/PeoplePanel";

const HR_TABS = ["progress", "library", "people"] as const;
type HrTab = (typeof HR_TABS)[number];

export function HrPage() {
  const { isHr, profile } = useAuth();
  const { t } = useT();
  const [activeTab, setActiveTab] = useState<HrTab>("progress");
  const { data: people = [] } = useQuery({ ...profilesQuery, enabled: isHr });
  const { data: assignments = [] } = useQuery({ ...visibleAssignmentsQuery, enabled: isHr });

  // The UI check only hides the page; row-level security is what actually restricts the data.
  if (!profile) return null;
  if (!isHr) return <EmptyState message={t.hr.onlyHr} />;

  const tabOptions = HR_TABS.map((tab) => ({ value: tab, label: t.hr.tabs[tab] }));

  return (
    <section className="mt-7">
      <SectionHeader title={t.nav.hr} meta={t.common.people(people.length)} />
      <PillToggleGroup
        options={tabOptions}
        value={activeTab}
        onChange={setActiveTab}
        ariaLabel={t.nav.hr}
      />
      {activeTab === "progress" && (
        <ProgressTable people={people} assignments={assignments} emptyMessage={t.hr.noEmployees} />
      )}
      {activeTab === "library" && <LibraryPanel />}
      {activeTab === "people" && <PeoplePanel />}
    </section>
  );
}
