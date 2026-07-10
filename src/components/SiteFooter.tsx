import Link from "next/link";
import { Radar } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.07] bg-[var(--bg-elev)]/60">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#ff6a2b,#ff2d6f)]">
                <Radar size={18} className="text-white" strokeWidth={2.4} />
              </span>
              <span className="text-[15px] font-bold text-white">GharRadar</span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[var(--fg-muted)]">
              Real estate intelligence for Mumbai &amp; Pune. Search any builder
              or MahaRERA number and see the full project picture before you buy.
            </p>
          </div>

          <FooterCol
            title="Platform"
            links={[
              { href: "/", label: "RERA Search" },
              { href: "/search", label: "All Projects" },
              { href: "/map", label: "Map Explorer" },
              { href: "/insights", label: "Market Insights" },
            ]}
          />
          <FooterCol
            title="Cities"
            links={[
              { href: "/search?city=Mumbai", label: "Mumbai" },
              { href: "/search?city=Pune", label: "Pune" },
              { href: "/search?status=Completed", label: "Completed" },
              { href: "/search?status=New Launch", label: "New Launches" },
            ]}
          />
          <FooterCol
            title="Data sources"
            links={[
              { href: "https://maharera.maharashtra.gov.in", label: "MahaRERA", external: true },
              { href: "#", label: "IGR Maharashtra" },
              { href: "#", label: "CPCB · Air Quality" },
              { href: "#", label: "MMRDA · Infra" },
            ]}
          />
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-white/[0.06] pt-6 text-[11px] text-[var(--fg-dim)] sm:flex-row sm:items-center">
          <span>
            © {new Date().getFullYear()} GharRadar · Data compiled from MahaRERA
            public records. Indicative, not an offer.
          </span>
          <span>Built for homebuyers, not brokers.</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string; external?: boolean }[];
}) {
  return (
    <div>
      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--fg-dim)]">
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              href={l.href}
              {...(l.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="text-sm text-[var(--fg-muted)] transition-colors hover:text-white"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
