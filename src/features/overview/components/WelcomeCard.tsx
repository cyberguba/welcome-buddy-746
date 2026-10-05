import { Link } from "@tanstack/react-router";
import { useT } from "@/shared/i18n";
import { ProgressBar } from "@/shared/components/ProgressBar";
import type { AssignmentSummary } from "@/shared/lib/assignments";

interface WelcomeCardProps {
  firstName: string;
  summary: AssignmentSummary;
  continueTo: "/documents" | "/courses";
}

export function WelcomeCard({ firstName, summary, continueTo }: WelcomeCardProps) {
  const { t } = useT();
  return (
    <div className="glass-strong animate-rise rounded-[28px] p-6">
      <div className="inline-flex items-center rounded-full bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-accent-foreground">
        {t.overview.welcome}
      </div>
      <h1 className="mt-3 font-display text-[28px] font-bold leading-[1.15] tracking-tight">
        {t.overview.title} <span className="text-primary">{firstName}.</span>
      </h1>
      <div className="mt-5 flex items-end justify-between">
        <div className="font-display text-[36px] font-extrabold leading-none text-primary">
          {summary.percentDone}%
        </div>
        <div className="text-[12px] font-medium text-muted-foreground">
          {t.overview.itemsDone(summary.doneCount, summary.totalCount)}
        </div>
      </div>
      <div className="mt-3">
        <ProgressBar percent={summary.percentDone} hasGradient />
      </div>
      <Link
        to={continueTo}
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
  );
}
