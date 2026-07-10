"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Radar, Menu, X, Search, Map, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ButtonLink } from "@/components/ui/button";

const LINKS = [
  { href: "/", label: "RERA Search", icon: Search, exact: true },
  { href: "/map", label: "Map Explorer", icon: Map },
  { href: "/insights", label: "Market Insights", icon: BarChart3 },
];

export function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-[900] transition-all duration-300",
        scrolled
          ? "border-b border-white/[0.07] bg-[rgba(7,7,12,0.82)] backdrop-blur-xl"
          : "border-b border-transparent"
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#ff6a2b,#ff2d6f)] shadow-[0_6px_20px_-6px_rgba(255,106,43,0.7)]">
            <Radar size={19} className="text-white" strokeWidth={2.4} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-bold tracking-tight text-white">
              GharRadar
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              MahaRERA Intel
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors",
                isActive(l.href, l.exact)
                  ? "bg-white/[0.07] text-white"
                  : "text-[var(--fg-muted)] hover:text-white"
              )}
            >
              <l.icon size={14} />
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:block">
          <ButtonLink href="/search" size="sm" variant="secondary">
            Explore projects
          </ButtonLink>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-white md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/[0.07] bg-[rgba(7,7,12,0.97)] px-4 py-3 backdrop-blur-xl md:hidden">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-3 text-sm font-medium",
                isActive(l.href, l.exact)
                  ? "bg-white/[0.06] text-white"
                  : "text-[var(--fg-muted)]"
              )}
            >
              <l.icon size={16} />
              {l.label}
            </Link>
          ))}
          <ButtonLink
            href="/search"
            size="sm"
            className="mt-2 w-full"
            onClick={() => setOpen(false)}
          >
            Explore projects
          </ButtonLink>
        </div>
      )}
    </header>
  );
}
