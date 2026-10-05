import { useT } from "@/shared/i18n";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProgressBar } from "@/shared/components/ProgressBar";
import { EmptyState } from "@/shared/components/EmptyState";
import { PlanTimeline } from "@/features/plan/components/PlanTimeline";
import { useAuth } from "@/features/auth/use-auth";
import { assignmentsQuery, profileQuery, summarize } from "@/shared/api/induction-api";
import { isOverdue, shortDate } from "@/shared/lib/format";

export function PlanPage({ viewUserId }: { viewUserId?: string | undefined }) {
  const { userId } = useAuth();
  const { t, lang } = useT();
  const target = viewUserId ?? userId ?? "";
  const isOther = !!viewUserId && viewUserId !== userId;
  const [hideDone, setHideDone] = useState(false);
  const { data: list = [], isLoading } = useQuery({
    ...assignmentsQuery(target),
    enabled: !!target,
  });
  const { data: person } = useQuery({ ...profileQuery(target), enabled: isOther });

  const totals = summarize(list);
  const overdue = list.filter((a) => isOverdue(a.due_date, a.progress)).length;
  const last = list
    .map((a) => a.due_date)
    .filter(Boolean)
    .sort()
    .at(-1);
  const visible = hideDone ? list.filter((a) => a.progress < 100) : list;
  const name = person?.profile?.full_name;

  return (
    <section className="mt-7">
      <div className="glass-strong animate-rise rounded-[28px] p-6">
        <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
          {t.plan.kicker}
        </div>
        <h1 className="mt-1 font-display text-[24px] font-bold">
          {isOther ? t.plan.of(name ?? t.plan.employee) : t.plan.mine}
        </h1>
        <div className="mt-4 flex flex-wrap items-end gap-6">
          <div className="font-display text-[32px] font-extrabold leading-none text-primary">
            {totals.pct}%
          </div>
          <Stat label={t.plan.done} value={`${totals.done}/${totals.total}`} />
          <Stat label={t.plan.overdue} value={String(overdue)} danger={overdue > 0} />
          <Stat label={t.plan.finishes} value={last ? shortDate(last, lang) : "—"} />
        </div>
        <div className="mt-3">
          <ProgressBar pct={totals.pct} gradient />
        </div>
      </div>

      <label className="mt-6 mb-4 inline-flex cursor-pointer items-center gap-2 text-[12px] font-medium text-muted-foreground">
        <input
          type="checkbox"
          checked={hideDone}
          onChange={(e) => setHideDone(e.target.checked)}
          className="accent-primary"
        />
        {t.plan.hideDone}
      </label>

      <PlanTimeline items={visible} />
      {!isLoading && visible.length === 0 && (
        <EmptyState message={list.length ? t.plan.allDone : t.plan.nothing} />
      )}
    </section>
  );
}

function Stat({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div>
      <div className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </div>
      <div
        className={
          danger ? "text-[14px] font-semibold text-destructive" : "text-[14px] font-semibold"
        }
      >
        {value}
      </div>
    </div>
  );
}
