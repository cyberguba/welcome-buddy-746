import type { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background text-foreground">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-4 h-[520px] w-[520px] rounded-full bg-blob-1 opacity-60 blur-[120px]" />
        <div className="absolute -top-16 right-[-80px] h-[460px] w-[460px] rounded-full bg-blob-2 opacity-70 blur-[120px]" />
        <div className="absolute bottom-[-120px] left-1/3 h-[420px] w-[560px] rounded-full bg-blob-3 opacity-60 blur-[130px]" />
      </div>

      <div className="relative mx-auto max-w-[1180px] px-6 py-7">
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
