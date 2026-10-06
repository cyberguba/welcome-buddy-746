import { Link } from "@tanstack/react-router";
import { useT } from "@/shared/i18n";
import { PostimeesLogo } from "@/shared/components/PostimeesLogo";
import { getInitials } from "@/shared/lib/format";
import { useAuth } from "@/features/auth/use-auth";
import { LanguageMenu } from "./LanguageMenu";
import { ViewAsPicker } from "./ViewAsPicker";
import { NAV_ITEMS } from "./navigation";

export function Header() {
  const { profile, roles } = useAuth();
  const { t } = useT();
  const navItems = NAV_ITEMS.filter(
    (item) => !item.requiredRole || roles.includes(item.requiredRole),
  );

  return (
    <>
      <header className="glass grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-2xl px-4 py-3 sm:px-5 md:flex md:justify-between">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <PostimeesLogo className="h-5 w-auto shrink-0 text-foreground sm:h-7" />
          <div className="hidden whitespace-nowrap border-l border-border pl-3 text-[0.6875rem] font-medium text-muted-foreground sm:block md:hidden xl:block">
            {t.header.onboarding}
          </div>
        </Link>

        <nav className="hidden items-center gap-5 whitespace-nowrap text-[0.8125rem] font-medium text-muted-foreground md:flex">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: true }}
              className="transition hover:text-foreground"
              activeProps={{ className: "text-foreground" }}
            >
              {t.nav[item.labelKey]}
            </Link>
          ))}
        </nav>

        <div className="flex min-w-0 items-center justify-end gap-1 sm:gap-2">
          <ViewAsPicker />
          <LanguageMenu />
          <div
            aria-hidden
            className="hidden size-9 shrink-0 place-items-center rounded-full bg-accent text-[0.75rem] font-bold text-accent-foreground ring-1 ring-border sm:grid"
          >
            {getInitials(profile?.full_name ?? "")}
          </div>
        </div>
      </header>

      {navItems.length > 0 && (
        <nav className="mt-4 flex flex-wrap gap-2 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: true }}
              className="glass rounded-full px-3 py-1.5 text-[0.75rem] font-medium text-muted-foreground shadow-none"
              activeProps={{ className: "text-primary" }}
            >
              {t.nav[item.labelKey]}
            </Link>
          ))}
        </nav>
      )}
    </>
  );
}
