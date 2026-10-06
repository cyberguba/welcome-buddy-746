import { cn } from "@/lib/utils";

interface PillOption<T extends string> {
  value: T;
  label: string;
}

interface PillToggleGroupProps<T extends string> {
  options: PillOption<T>[];
  value: T;
  onChange: (value: T) => void;
  ariaLabel: string;
}

/** A row of pill buttons where exactly one is selected (filters, tabs). */
export function PillToggleGroup<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: PillToggleGroupProps<T>) {
  return (
    <div role="group" aria-label={ariaLabel} className="mb-4 flex flex-wrap gap-2">
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-full px-3 py-1.5 text-[0.75rem] font-semibold transition",
              isSelected
                ? "bg-foreground text-background"
                : "glass text-muted-foreground shadow-none",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
