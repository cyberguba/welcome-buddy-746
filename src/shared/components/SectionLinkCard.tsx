import { Link } from "@tanstack/react-router";
import { ProgressBar } from "./ProgressBar";

interface SectionLinkCardProps {
  title: string;
  meta: string;
  to: "/documents" | "/courses" | "/contacts";
  callToAction: string;
  percent?: number;
}

export function SectionLinkCard({ title, meta, to, callToAction, percent }: SectionLinkCardProps) {
  return (
    <Link
      to={to}
      className="glass animate-rise group block rounded-2xl p-5 transition hover:bg-card"
    >
      <div className="font-display text-[15px] font-bold">{title}</div>
      <div className="mt-1 text-[12px] font-medium text-muted-foreground">{meta}</div>
      {percent !== undefined && (
        <div className="mt-3">
          <ProgressBar percent={percent} label={title} />
        </div>
      )}
      <div className="mt-4 text-[12px] font-semibold text-primary">
        {callToAction}{" "}
        <span aria-hidden className="inline-block transition group-hover:translate-x-0.5">
          →
        </span>
      </div>
    </Link>
  );
}
