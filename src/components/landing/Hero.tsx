import Link from "next/link";
import { TrendingUp, ShieldCheck, MapPin } from "lucide-react";
import { SearchBox } from "@/components/search/SearchBox";
import { platformStats } from "@/data/rera";

const CHIPS = [
  { label: "Lodha", q: "/search?q=Lodha" },
  { label: "Godrej", q: "/search?q=Godrej" },
  { label: "Kolte-Patil", q: "/search?q=Kolte-Patil" },
  { label: "P52100027629", q: "/search?q=P52100027629" },
  { label: "Worli", q: "/search?q=Worli" },
];

export function Hero() {
  const s = platformStats();
  return (
    <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
      {/* Backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid radial-fade opacity-60" />
        <div className="absolute left-1/2 top-[-10%] h-[520px] w-[820px] max-w-[110vw] -translate-x-1/2 glow-accent blur-[80px] opacity-70" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[var(--bg)] to-transparent" />
      </div>

      <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
        <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-[12px] font-medium text-[var(--fg-muted)]">
          <span className="flex h-1.5 w-1.5 rounded-full bg-[var(--green)] pulse-ring" />
          Live MahaRERA data · Mumbai &amp; Pune
        </div>

        <h1
          className="animate-fade-up mt-6 text-balance text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl"
          style={{ animationDelay: "60ms" }}
        >
          Know the builder
          <br />
          <span className="text-gradient-brand">before you buy the home.</span>
        </h1>

        <p
          className="animate-fade-up mx-auto mt-6 max-w-2xl text-[16px] leading-relaxed text-[var(--fg-muted)] sm:text-lg"
          style={{ animationDelay: "120ms" }}
        >
          Type a builder&rsquo;s name or any MahaRERA number and instantly see
          their full track record — completed, under-construction and lapsed
          projects, complaints, delivery delays and pricing. All in one place.
        </p>

        <div
          className="animate-fade-up mx-auto mt-9 max-w-2xl"
          style={{ animationDelay: "180ms" }}
        >
          <SearchBox size="lg" />
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[12px]">
            <span className="text-[var(--fg-dim)]">Popular:</span>
            {CHIPS.map((c) => (
              <Link
                key={c.label}
                href={c.q}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)]/40 hover:text-white"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>

        <div
          className="animate-fade-up mx-auto mt-12 grid max-w-2xl grid-cols-3 gap-3"
          style={{ animationDelay: "240ms" }}
        >
          <HeroStat
            icon={<TrendingUp size={15} />}
            value={`${s.projects}+`}
            label="Projects tracked"
          />
          <HeroStat
            icon={<ShieldCheck size={15} />}
            value={`${s.builders}`}
            label="Developers"
          />
          <HeroStat
            icon={<MapPin size={15} />}
            value="2"
            label="Cities live"
          />
        </div>
      </div>
    </section>
  );
}

function HeroStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-3.5">
      <div className="flex items-center justify-center gap-1.5 text-[var(--accent)]">
        {icon}
        <span className="text-xl font-bold text-white">{value}</span>
      </div>
      <div className="mt-1 text-[11px] text-[var(--fg-muted)]">{label}</div>
    </div>
  );
}
