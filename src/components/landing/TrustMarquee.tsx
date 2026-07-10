import { BUILDERS } from "@/data/rera";

export function TrustMarquee() {
  const names = BUILDERS.map((b) => b.name.replace(/\s*\(.*\)/, ""));
  const doubled = [...names, ...names];
  return (
    <div className="relative overflow-hidden border-y border-white/[0.06] bg-white/[0.015] py-5">
      <p className="mb-4 text-center text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--fg-dim)]">
        Track record on every major developer
      </p>
      <div className="relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <div className="animate-marquee flex shrink-0 items-center gap-10 pr-10">
          {doubled.map((n, i) => (
            <span
              key={i}
              className="whitespace-nowrap text-sm font-semibold text-[var(--fg-muted)]/70"
            >
              {n}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
