import { Reveal } from "@/components/Reveal";
import {
  FileSearch,
  AlertTriangle,
  LineChart,
  Layers,
} from "lucide-react";

const PROPS = [
  {
    icon: FileSearch,
    title: "Full builder track record",
    body: "Every project a developer has registered with MahaRERA — completed, ongoing, launched or lapsed — with delivery dates and on-time %.",
    color: "#ff6a2b",
  },
  {
    icon: AlertTriangle,
    title: "Spot the red flags early",
    body: "Complaint counts, RERA extensions, litigation status and stalled projects surfaced up front, so you avoid the risky ones.",
    color: "#ff5252",
  },
  {
    icon: LineChart,
    title: "Real pricing & inventory",
    body: "Ticket sizes, ₹/sq-ft, carpet-area ranges and how much inventory is actually booked — no inflated brochure numbers.",
    color: "#40c4ff",
  },
  {
    icon: Layers,
    title: "Everything, visualised",
    body: "Registration details laid out as clean dashboards and maps instead of clunky government PDFs. Decide in minutes, not days.",
    color: "#00e676",
  },
];

export function ValueProps() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-[12px] font-semibold uppercase tracking-wider text-[var(--accent)]">
          Why GharRadar
        </span>
        <h2 className="mt-3 text-3xl font-bold text-white sm:text-4xl">
          The homework nobody does — done for you
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-[var(--fg-muted)]">
          A ₹1-crore decision deserves more than a sales pitch. We turn scattered
          MahaRERA records into an instant, honest picture.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PROPS.map((p, i) => (
          <Reveal key={p.title} delay={i * 80}>
            <div className="group h-full rounded-2xl border border-white/[0.08] bg-[var(--bg-card)]/60 p-6 transition-colors hover:border-white/20">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                style={{ background: `${p.color}1f`, color: p.color }}
              >
                <p.icon size={20} />
              </span>
              <h3 className="mt-5 text-[16px] font-bold text-white">
                {p.title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--fg-muted)]">
                {p.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
