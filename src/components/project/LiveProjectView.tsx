import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Building2,
  CalendarCheck,
  CalendarClock,
  MapPin,
  Radio,
  ShieldCheck,
  Layers3,
  SearchX,
} from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { CopyButton } from "@/components/CopyButton";
import type { LiveProject, Provenance } from "@/lib/maharera";

const NOT_DISCLOSED = "Not disclosed on MahaRERA";

function Panel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[var(--bg-card)]/50 p-5 sm:p-6">
      <h2 className="mb-4 flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wider text-[var(--fg-muted)]">
        <span className="text-[var(--accent)]">{icon}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Fact({ k, v }: { k: string; v?: string }) {
  const disclosed = Boolean(v && v.trim());
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="text-[var(--fg-muted)]">{k}</dt>
      <dd
        className={
          disclosed
            ? "text-right font-semibold text-white"
            : "text-right text-[13px] italic text-[var(--fg-dim)]"
        }
      >
        {disclosed ? v : NOT_DISCLOSED}
      </dd>
    </div>
  );
}

/** Shown when a registration number could not be resolved live or in seed. */
export function LiveProjectMissing({
  rera,
  note,
}: {
  rera: string;
  note?: string;
}) {
  return (
    <>
      <SiteNav />
      <main className="grid min-h-dvh place-items-center px-4">
        <div className="max-w-md text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-[var(--fg-dim)]">
            <SearchX size={24} />
          </span>
          <h1 className="mt-6 text-2xl font-bold text-white">
            Couldn’t load{" "}
            <span className="font-mono text-[var(--accent)]">{rera}</span>
          </h1>
          <p className="mt-3 text-[14px] leading-relaxed text-[var(--fg-muted)]">
            {note ||
              "We couldn’t find this registration number on MahaRERA right now."}
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/search"
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-[13px] font-semibold text-white hover:bg-white/[0.08]"
            >
              Back to search
            </Link>
            <a
              href="https://maharera.maharashtra.gov.in/registered-project-search"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-4 py-2 text-[13px] font-semibold text-[var(--accent)] hover:bg-[var(--accent)]/20"
            >
              Check MahaRERA <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

export function LiveProjectView({
  live,
  provenance,
  fetchedAt,
}: {
  live: LiveProject;
  provenance: Provenance;
  fetchedAt?: string;
}) {
  const isCache = provenance === "cache";
  const fetched =
    fetchedAt &&
    new Date(fetchedAt).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <>
      <SiteNav />
      <main className="min-h-dvh">
        <div className="relative overflow-hidden border-b border-white/[0.06] pt-24 pb-10">
          <div className="pointer-events-none absolute inset-0 -z-10 bg-grid radial-fade opacity-40" />
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <Link
              href="/search"
              className="inline-flex items-center gap-1.5 text-[13px] text-[var(--fg-muted)] transition-colors hover:text-white"
            >
              <ArrowLeft size={14} /> All projects
            </Link>

            {/* Live provenance banner — honest about the source */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--green)]/30 bg-[var(--green)]/10 px-3 py-1.5 text-[12px] font-semibold text-[var(--green)]">
              <Radio size={13} />
              {isCache ? "Cached from MahaRERA" : "Live from MahaRERA"}
              {fetched && (
                <span className="font-normal text-[var(--fg-muted)]">· {fetched}</span>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <h1 className="text-3xl font-bold leading-tight text-white sm:text-[40px]">
                  {live.name || "MahaRERA registered project"}
                </h1>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[14px] text-[var(--fg-muted)]">
                  {live.promoter && (
                    <span className="inline-flex items-center gap-1.5 font-semibold text-white">
                      <Building2 size={14} /> {live.promoter}
                    </span>
                  )}
                  {(live.village || live.taluka || live.district) && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin size={14} className="text-[var(--accent)]" />
                      {[live.village, live.taluka, live.district]
                        .filter(Boolean)
                        .join(", ")}
                    </span>
                  )}
                </div>
              </div>

              <div className="shrink-0 rounded-2xl border border-white/[0.1] bg-[var(--bg-card)]/70 px-5 py-4">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-[var(--fg-dim)]">
                  MahaRERA Registration
                </div>
                <div className="mt-1.5 font-mono text-lg font-bold tracking-tight text-[var(--accent)]">
                  {live.rera}
                </div>
                <div className="mt-2 flex items-center gap-4 text-[11px] text-[var(--fg-muted)]">
                  <CopyButton value={live.rera} className="hover:text-white" />
                  <a
                    href={
                      live.sourceUrl ||
                      "https://maharera.maharashtra.gov.in/registered-project-search"
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 hover:text-white"
                  >
                    Verify on MahaRERA <ArrowUpRight size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-2">
            <Panel title="Registration & status" icon={<ShieldCheck size={16} />}>
              <dl className="divide-y divide-white/[0.06] text-[13.5px]">
                <Fact k="Project status" v={live.status} />
                <Fact k="Project type" v={live.projectType} />
                <Fact k="Registered on" v={live.registeredOn} />
                <Fact k="Litigations on record" v={live.litigations} />
              </dl>
            </Panel>

            <Panel title="Delivery timeline" icon={<CalendarClock size={16} />}>
              <dl className="divide-y divide-white/[0.06] text-[13.5px]">
                <Fact k="Proposed completion" v={live.proposedCompletion} />
                <Fact k="Revised completion" v={live.revisedCompletion} />
              </dl>
            </Panel>

            <Panel title="Location" icon={<MapPin size={16} />}>
              <dl className="divide-y divide-white/[0.06] text-[13.5px]">
                <Fact k="District" v={live.district} />
                <Fact k="Taluka" v={live.taluka} />
                <Fact k="Village" v={live.village} />
                <Fact k="Pincode" v={live.pincode} />
              </dl>
            </Panel>

            <Panel title="Project scale" icon={<Layers3 size={16} />}>
              <dl className="divide-y divide-white/[0.06] text-[13.5px]">
                <Fact k="Total land area" v={live.totalArea} />
                <Fact k="Buildings / wings" v={live.totalBuildings} />
                <Fact k="Apartments" v={live.totalApartments} />
              </dl>
            </Panel>
          </div>

          {/* Any extra scraped fields we don't model explicitly */}
          {live.extra && Object.keys(live.extra).length > 0 && (
            <div className="mt-6">
              <Panel title="Other disclosures" icon={<CalendarCheck size={16} />}>
                <dl className="divide-y divide-white/[0.06] text-[13.5px]">
                  {Object.entries(live.extra).map(([k, v]) => (
                    <Fact key={k} k={k} v={v} />
                  ))}
                </dl>
              </Panel>
            </div>
          )}

          <p className="mt-8 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-[12.5px] leading-relaxed text-[var(--fg-muted)]">
            Data on this page is pulled directly from the public MahaRERA
            registry for registration{" "}
            <span className="font-mono text-white">{live.rera}</span>. Fields the
            registry does not publish are shown as “{NOT_DISCLOSED}”. Always
            verify critical details on the{" "}
            <a
              href={live.sourceUrl || "https://maharera.maharashtra.gov.in"}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[var(--accent)] hover:underline"
            >
              official MahaRERA portal
            </a>
            .
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
