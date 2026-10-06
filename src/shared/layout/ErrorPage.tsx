import { useEffect } from "react";
import { useRouter } from "@tanstack/react-router";
import { useT } from "@/shared/i18n";
import { logger } from "@/shared/lib/logger";
import { PRIMARY_BUTTON_CLASS, SECONDARY_BUTTON_CLASS } from "./page-styles";

interface ErrorPageProps {
  error: Error;
  reset: () => void;
}

/** Shown when a page throws while rendering or loading; offers a retry without a full reload. */
export function ErrorPage({ error, reset }: ErrorPageProps) {
  const { t } = useT();
  const router = useRouter();

  useEffect(() => {
    logger.error("Page failed to render", error);
  }, [error]);

  const retry = () => {
    router.invalidate();
    reset();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          {t.errorPage.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t.errorPage.text}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button type="button" onClick={retry} className={PRIMARY_BUTTON_CLASS}>
            {t.errorPage.retry}
          </button>
          <a href="/" className={SECONDARY_BUTTON_CLASS}>
            {t.notFound.home}
          </a>
        </div>
      </div>
    </div>
  );
}
