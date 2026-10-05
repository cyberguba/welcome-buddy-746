import { useT } from "@/shared/i18n";

interface LibraryItemRowProps {
  title: string;
  meta: string;
  isDeleting: boolean;
  onDelete: () => void;
}

/** One course or document in the library, with a delete button that asks for confirmation. */
export function LibraryItemRow({ title, meta, isDeleting, onDelete }: LibraryItemRowProps) {
  const { t } = useT();
  const confirmAndDelete = () => {
    if (window.confirm(t.library.confirmDelete(title))) onDelete();
  };

  return (
    <div className="flex items-center gap-3 rounded-xl bg-card/70 px-3 py-2 ring-1 ring-border">
      <span className="flex-1 text-[13px] font-medium">{title}</span>
      <span className="text-[11px] text-muted-foreground">{meta}</span>
      <button
        type="button"
        onClick={confirmAndDelete}
        disabled={isDeleting}
        aria-label={t.library.deleteItem(title)}
        className="text-[11px] font-semibold text-destructive"
      >
        {t.library.delete}
      </button>
    </div>
  );
}
