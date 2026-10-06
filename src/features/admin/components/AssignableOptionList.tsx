import type { AssignableItem } from "@/shared/api/assignments";

export interface AssignableOption extends AssignableItem {
  title: string;
  meta: string;
}

interface AssignableOptionListProps {
  title: string;
  emptyMessage: string;
  options: AssignableOption[];
  isSelected: (item: AssignableItem) => boolean;
  onToggle: (item: AssignableItem) => void;
}

export function AssignableOptionList({
  title,
  emptyMessage,
  options,
  isSelected,
  onToggle,
}: AssignableOptionListProps) {
  return (
    <fieldset>
      <legend className="mb-2 text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        {title}
      </legend>
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={`${option.kind}-${option.id}`}
            className="flex cursor-pointer items-center gap-3 rounded-xl bg-card/70 px-3 py-2 ring-1 ring-border"
          >
            <input
              type="checkbox"
              checked={isSelected(option)}
              onChange={() => onToggle({ kind: option.kind, id: option.id })}
              className="accent-primary"
            />
            <span className="flex-1 text-[0.8125rem] font-medium">{option.title}</span>
            <span className="text-[0.6875rem] text-muted-foreground">{option.meta}</span>
          </label>
        ))}
        {options.length === 0 && (
          <p className="text-[0.75rem] text-muted-foreground">{emptyMessage}</p>
        )}
      </div>
    </fieldset>
  );
}
