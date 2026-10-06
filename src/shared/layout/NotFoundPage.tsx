import { Link } from "@tanstack/react-router";
import { useT } from "@/shared/i18n";
import { PRIMARY_BUTTON_CLASS } from "./page-styles";

export function NotFoundPage() {
  const { t } = useT();
  return (
    <section className="flex items-center justify-center px-4 py-24">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">{t.notFound.title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{t.notFound.text}</p>
        <div className="mt-6">
          <Link to="/" className={PRIMARY_BUTTON_CLASS}>
            {t.notFound.home}
          </Link>
        </div>
      </div>
    </section>
  );
}
