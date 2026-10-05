import { useT } from "@/shared/i18n";
import type { StatusFilter } from "@/shared/types/induction";
import { PillToggleGroup } from "./PillToggleGroup";

const STATUS_FILTERS: StatusFilter[] = ["All", "Pending", "Completed"];

interface StatusFilterBarProps {
  value: StatusFilter;
  onChange: (value: StatusFilter) => void;
}

export function StatusFilterBar({ value, onChange }: StatusFilterBarProps) {
  const { t } = useT();
  const options = STATUS_FILTERS.map((filter) => ({ value: filter, label: t.filters[filter] }));
  return (
    <PillToggleGroup
      options={options}
      value={value}
      onChange={onChange}
      ariaLabel={t.common.progress}
    />
  );
}
