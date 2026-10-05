import { useT } from "@/shared/i18n";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/shared/components/SectionHeader";
import { EmptyState } from "@/shared/components/EmptyState";
import { ProgressTable } from "@/features/admin/components/ProgressTable";
import { LibraryPanel } from "@/features/admin/components/LibraryPanel";
import { PeoplePanel } from "@/features/admin/components/PeoplePanel";
import { assignmentsQuery, profilesQuery } from "@/shared/api/induction-api";
import { useAuth } from "@/features/auth/use-auth";

const TABS = ["progress", "library", "people"] as const;

export function HrPage() {
  const { isHr, profile } = useAuth();
  const { t } = useT();
  const [tab, setTab] = useState<(typeof TABS)[number]>("progress");
  const { data: people = [] } = useQuery({ ...profilesQuery, enabled: isHr });
  const { data: assignments = [] } = useQuery({ ...assignmentsQuery(), enabled: isHr });

  if (!profile) return null;
  if (!isHr) return <EmptyState message={t.hr.onlyHr} />;

  return (
    <section className="mt-7">
      <SectionHeader title={t.nav.hr} meta={t.common.people(people.length)} />
      <div className="mb-4 flex gap-2">
        {TABS.map((tb) => (
          <button
            key={tb}
            type="button"
            onClick={() => setTab(tb)}
            className={cn(
              "rounded-full px-3 py-1.5 text-[12px] font-semibold transition",
              tab === tb
                ? "bg-foreground text-background"
                : "glass text-muted-foreground shadow-none",
            )}
          >
            {t.hr.tabs[tb]}
          </button>
        ))}
      </div>
      {tab === "progress" && (
        <ProgressTable people={people} assignments={assignments} emptyMessage={t.hr.noEmployees} />
      )}
      {tab === "library" && <LibraryPanel />}
      {tab === "people" && <PeoplePanel />}
    </section>
  );
}
