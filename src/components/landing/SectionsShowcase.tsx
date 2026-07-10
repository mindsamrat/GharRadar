import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { Search, Map, BarChart3, ArrowUpRight } from "lucide-react";

const SECTIONS = [
  {
    href: "/search",
    icon: Search,
    kicker: "01 · Intelligence",
    title: "RERA Project Search",
    body: "Look up any builder or MahaRERA number and dig into completed vs. ongoing projects, complaints, financials and delivery history.",
    color: "#ff6a2b",
    cta: "Search projects",
    featured: true,
  },
  {
    href: "/map",
    icon: Map,
    kicker: "02 · Explore",
    title: "Micro-market Map",
    body: "The live Mumbai map — price heatmaps, investment scores, safety, air quality and infrastructure impact across 25 micro-markets.",
    color: "#40c4ff",
    cta: "Open the map",
  },
  {
    href: "/insights",
    icon: BarChart3,
    kicker: "03 · Analyse",
    title: "Market Insights",
    body: "City-level trends, infrastructure that moves prices, builder league tables and where the next growth corridors are forming.",
    color: "#b388ff",
    cta: "View insights",
  },
];

export function SectionsShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--accent)]">
          Three ways in
        </span>
        <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
          One platform, three lenses on the market
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-5 lg:grid-cols-3">
        {SECTIONS.map((s, i) => (
          <Reveal key={s.href} delay={i * 90} className={s.featured ? "lg:row-span-1" : ""}>
            <Link
              href={s.href}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-[var(--bg-card)]/60 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-white/20"
            >
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full opacity-20 blur-3xl transition-opacity duration-300 group-hover:opacity-40"
                style={{ background: s.color }}
                aria-hidden
              />
              {s.featured && (
                <span className="absolute right-5 top-5 rounded-full border border-[var(--accent)]/30 bg-[var(--accent)]/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent)]">
                  Main
                </span>
              )}
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl"
                style={{ background: `${s.color}1f`, color: s.color }}
              >
                <s.icon size={22} />
              </span>
              <span className="mt-6 text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-dim)]">
                {s.kicker}
              </span>
              <h3 className="mt-2 text-xl font-bold text-white">{s.title}</h3>
              <p className="mt-2.5 flex-1 text-[13.5px] leading-relaxed text-[var(--fg-muted)]">
                {s.body}
              </p>
              <span
                className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold"
                style={{ color: s.color }}
              >
                {s.cta}
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
