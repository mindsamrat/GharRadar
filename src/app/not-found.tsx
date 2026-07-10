import { Radar, ArrowLeft, Search } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grid radial-fade opacity-50" />
      <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-72 w-[600px] max-w-[100vw] -translate-x-1/2 glow-accent blur-[90px] opacity-50" />

      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#ff6a2b,#ff2d6f)]">
        <Radar size={26} className="text-white" />
      </span>
      <h1 className="mt-8 text-6xl font-bold text-white">404</h1>
      <p className="mt-3 max-w-md text-[15px] text-[var(--fg-muted)]">
        We couldn&rsquo;t find that page. The project or developer may have
        moved, or the MahaRERA number doesn&rsquo;t match our records.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/">
          <ArrowLeft size={16} /> Back home
        </ButtonLink>
        <ButtonLink href="/search" variant="secondary">
          <Search size={16} /> Search projects
        </ButtonLink>
      </div>
    </main>
  );
}
