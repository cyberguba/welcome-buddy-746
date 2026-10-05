import { cn } from "@/lib/utils";
import { useT } from "@/shared/i18n";

interface ProgressBarProps {
  percent: number;
  hasGradient?: boolean;
  label?: string;
}

export function ProgressBar({ percent, hasGradient = false, label }: ProgressBarProps) {
  const { t } = useT();
  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
      role="progressbar"
      aria-label={label ?? t.common.progress}
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn(
          "animate-grow h-full rounded-full",
          hasGradient ? "bg-gradient-primary" : "bg-primary",
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}
