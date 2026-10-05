import { useT } from "@/shared/i18n";
import { cn } from "@/lib/utils";
import type { StatusFilter } from "@/shared/types/induction";

const OPTIONS: StatusFilter[] = ["All", "Pending", "Completed"];

interface StatusFilterBarProps {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}

export function StatusFilterBar({ value, onChange }: StatusFilterBarProps) {
  const { t } = useT();
  return (
    <div className="mb-4 flex gap-2">
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "rounded-full px-3 py-1.5 text-[12px] font-semibold transition",
            value === option ? "bg-foreground text-background" : "glass text-muted-foreground shadow-none",
          )}
        >
          {t.filters[option]}
        </button>
      ))}
    </div>
  );
}
