import { cn } from "@/lib/utils";

interface ProgressBarProps {
  pct: number;
  gradient?: boolean;
  trackClassName?: string;
}

export function ProgressBar({ pct, gradient, trackClassName = "bg-muted" }: ProgressBarProps) {
  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full", trackClassName)} role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
      <div
        className={cn("animate-grow h-full rounded-full", gradient ? "bg-gradient-primary" : "bg-primary")}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
