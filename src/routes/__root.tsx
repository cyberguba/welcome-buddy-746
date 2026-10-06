import { QueryClientProvider, type QueryClient } from "@tanstack/react-query";
import { HeadContent, Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { LanguageProvider } from "@/shared/i18n";
import { AppShell } from "@/shared/layout/AppShell";
import { ErrorPage } from "@/shared/layout/ErrorPage";
import { NotFoundPage } from "@/shared/layout/NotFoundPage";
import { AuthProvider } from "@/features/auth/AuthProvider";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { title: "Postimees sisseelamine" },
      {
        name: "description",
        content: "Uue töötaja sisseelamise keskkond dokumentide ja koolitustega.",
      },
      { property: "og:title", content: "Postimees sisseelamine" },
      {
        property: "og:description",
        content: "Uue töötaja sisseelamise keskkond dokumentide ja koolitustega.",
      },
    ],
  }),
  component: RootComponent,
  // Rendered inside the app shell, so it shares the shell's providers.
  notFoundComponent: NotFoundPage,
  // Replaces the whole app shell, so it needs its own language provider.
  errorComponent: ({ error, reset }) => (
    <LanguageProvider>
      <ErrorPage error={error} reset={reset} />
    </LanguageProvider>
  ),
});

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <HeadContent />
      <LanguageProvider>
        <AuthProvider>
          <AppShell>
            <Outlet />
          </AppShell>
          <Toaster richColors position="top-center" />
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}
