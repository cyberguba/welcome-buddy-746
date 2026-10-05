interface SectionHeaderProps {
  title: string;
  meta: string;
}

export function SectionHeader({ title, meta }: SectionHeaderProps) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="font-display text-[18px] font-bold tracking-tight">{title}</h2>
      <span className="text-[12px] font-medium text-muted-foreground">{meta}</span>
    </div>
  );
}
