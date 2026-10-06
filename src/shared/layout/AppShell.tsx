import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-4 h-[32.5rem] w-[32.5rem] rounded-full bg-blob-1 opacity-60 blur-[7.5rem]" />
        <div className="absolute -top-16 right-[-5rem] h-[28.75rem] w-[28.75rem] rounded-full bg-blob-2 opacity-70 blur-[7.5rem]" />
        <div className="absolute bottom-[-7.5rem] left-1/3 h-[26.25rem] w-[35rem] rounded-full bg-blob-3 opacity-60 blur-[8.125rem]" />
      </div>

      <div className="relative mx-auto max-w-[73.75rem] px-6 py-7">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
