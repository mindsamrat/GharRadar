import { ShieldCheck, ArrowRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";

/** Pseudo-random but SSR-stable delays for the pulsing grid cells & sparks. */
const CELLS = [
  { top: "18%", left: "12%", delay: "0s" },
  { top: "62%", left: "22%", delay: "1.3s" },
  { top: "34%", left: "78%", delay: "0.6s" },
  { top: "72%", left: "64%", delay: "2.1s" },
  { top: "24%", left: "48%", delay: "1.7s" },
];

const SPARKS = [
  { top: "20%", left: "16%", delay: "0s" },
  { top: "70%", left: "30%", delay: "1.1s" },
  { top: "40%", left: "82%", delay: "2.3s" },
  { top: "78%", left: "70%", delay: "0.7s" },
  { top: "30%", left: "58%", delay: "1.6s" },
];

export function BorderBeamCTA() {
  return (
    <div className="beam-card mx-auto max-w-4xl">
      {/* Rotating conic beam ring */}
      <div className="beam-card__ring" aria-hidden />

      {/* Corner brackets */}
      <span className="corner corner-tl" aria-hidden />
      <span className="corner corner-tr" aria-hidden />
      <span className="corner corner-bl" aria-hidden />
      <span className="corner corner-br" aria-hidden />

      <div className="beam-card__inner overflow-hidden px-6 py-14 sm:px-14 sm:py-16">
        {/* Blueprint grid */}
        <div className="absolute inset-0 bg-blueprint opacity-70" aria-hidden />
        {/* Pulsing cells */}
        {CELLS.map((c, i) => (
          <span
            key={i}
            className="cell-pulse"
            style={{ top: c.top, left: c.left, animationDelay: c.delay }}
            aria-hidden
          />
        ))}
        {/* Floating sparks */}
        {SPARKS.map((s, i) => (
          <span
            key={i}
            className="spark"
            style={{ top: s.top, left: s.left, animationDelay: s.delay }}
            aria-hidden
          />
        ))}

        <div className="relative z-10 text-center">
          {/* Radial glow behind heading */}
          <div
            className="pointer-events-none absolute left-1/2 top-0 h-48 w-[28rem] max-w-full -translate-x-1/2 glow-accent blur-2xl"
            aria-hidden
          />

          <span className="relative inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[var(--accent)]">
            <ShieldCheck size={13} />
            Verify before you buy
          </span>

          <h2 className="relative mx-auto mt-6 max-w-2xl text-balance text-3xl font-bold leading-tight text-white sm:text-[42px]">
            Don&rsquo;t take the brochure&rsquo;s word for it.
            <br className="hidden sm:block" />
            <span className="text-gradient-brand"> Check the record.</span>
          </h2>

          <p className="relative mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-[var(--fg-muted)]">
            Every registration, delivery date, complaint and rupee — pulled from
            MahaRERA and laid out visually. Know exactly who you&rsquo;re buying
            from before you sign.
          </p>

          <div className="relative mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/search" size="lg" className="w-full sm:w-auto">
              Search a builder <ArrowRight size={17} />
            </ButtonLink>
            <ButtonLink
              href="/map"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Open the map explorer
            </ButtonLink>
          </div>
        </div>
      </div>
    </div>
  );
}
