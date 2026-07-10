"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Building2,
  HardHat,
  ArrowRight,
  CornerDownLeft,
  Radio,
} from "lucide-react";
import { searchAll, type SearchResult, slugForResult } from "@/lib/search";
// Pure helpers only — importing from the lib index would pull server-only
// lookup code (fetch/data) into the client bundle.
import { looksLikeReraQuery, normalizeRera } from "@/lib/maharera/rera-number";
import { StatusBadge } from "@/components/ui/badge";
import { formatINR, cn } from "@/lib/utils";

const EXAMPLES = ["Lodha", "P52100027629", "Godrej", "Kolte-Patil", "Worli", "Hinjewadi"];

export function SearchBox({
  size = "lg",
  autoFocus = false,
}: {
  size?: "md" | "lg";
  autoFocus?: boolean;
}) {
  const router = useRouter();
  const [q, setQ] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const [placeholderIdx, setPlaceholderIdx] = React.useState(0);
  const boxRef = React.useRef<HTMLDivElement>(null);

  const results = React.useMemo<SearchResult[]>(
    () => (q.trim() ? searchAll(q).slice(0, 7) : []),
    [q]
  );

  // Offer a live MahaRERA lookup when the query looks like a registration
  // number that isn't already an exact match in the curated dataset.
  const normalizedRera = normalizeRera(q);
  const hasExactProject = results.some(
    (r) => r.kind === "project" && r.item.rera.toUpperCase() === normalizedRera
  );
  const offerLive = looksLikeReraQuery(q) && !hasExactProject;
  const goLive = () => {
    router.push(`/project/${normalizedRera}`);
    setOpen(false);
  };

  // Rotating placeholder examples
  React.useEffect(() => {
    if (q) return;
    const t = setInterval(
      () => setPlaceholderIdx((i) => (i + 1) % EXAMPLES.length),
      2400
    );
    return () => clearInterval(t);
  }, [q]);

  React.useEffect(() => {
    setActive(0);
  }, [q]);

  // Close on outside click
  React.useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const go = (r: SearchResult) => {
    router.push(slugForResult(r));
    setOpen(false);
  };

  const submit = () => {
    if (results.length > 0) {
      go(results[active] ?? results[0]);
    } else if (offerLive) {
      goLive();
    } else if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q.trim())}`);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      submit();
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const tall = size === "lg";

  return (
    <div ref={boxRef} className="relative w-full">
      <div
        className={cn(
          "group relative flex items-center gap-3 rounded-2xl border bg-[rgba(13,13,22,0.9)] backdrop-blur-md transition-all",
          open && q
            ? "border-[var(--accent)]/50 shadow-[0_0_0_4px_rgba(255,106,43,0.1)]"
            : "border-white/12 hover:border-white/20",
          tall ? "px-5 py-4" : "px-4 py-3"
        )}
      >
        <Search
          size={tall ? 22 : 18}
          className="shrink-0 text-[var(--fg-dim)] group-focus-within:text-[var(--accent)] transition-colors"
        />
        <input
          value={q}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder={`Try "${EXAMPLES[placeholderIdx]}" — builder, project or MahaRERA no.`}
          className={cn(
            "w-full bg-transparent text-white outline-none placeholder:text-[var(--fg-dim)]",
            tall ? "text-base sm:text-lg" : "text-sm"
          )}
          aria-label="Search builders, projects or MahaRERA numbers"
        />
        <kbd className="hidden shrink-0 items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-medium text-[var(--fg-dim)] sm:flex">
          <CornerDownLeft size={11} /> Enter
        </kbd>
      </div>

      {open && q.trim() && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[rgba(11,11,19,0.98)] shadow-[0_24px_60px_-12px_rgba(0,0,0,0.8)] backdrop-blur-xl animate-scale-in">
          {results.length === 0 ? (
            offerLive ? (
              <div className="p-2">
                <button
                  onClick={goLive}
                  className="flex w-full items-center gap-3 rounded-xl bg-[var(--green)]/[0.08] px-3 py-3 text-left hover:bg-[var(--green)]/[0.14]"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--green)]/15 text-[var(--green)]">
                    <Radio size={16} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-white">
                      Look up{" "}
                      <span className="font-mono text-[var(--green)]">
                        {normalizedRera}
                      </span>{" "}
                      on MahaRERA
                    </span>
                    <span className="mt-0.5 block text-[11px] text-[var(--fg-muted)]">
                      Live registry lookup · not in the curated set
                    </span>
                  </span>
                  <ArrowRight size={15} className="shrink-0 text-[var(--green)]" />
                </button>
              </div>
            ) : (
              <div className="px-5 py-6 text-center text-sm text-[var(--fg-muted)]">
                No matches for{" "}
                <span className="text-white">&ldquo;{q}&rdquo;</span>. Press Enter
                to browse all projects.
              </div>
            )
          ) : (
            <ul className="max-h-[380px] overflow-y-auto py-2">
              {results.map((r, i) => (
                <li key={r.kind + slugForResult(r)}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(r)}
                    className={cn(
                      "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                      i === active ? "bg-white/[0.06]" : "hover:bg-white/[0.03]"
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                        r.kind === "builder"
                          ? "bg-[var(--violet)]/12 text-[var(--violet)]"
                          : "bg-[var(--accent)]/12 text-[var(--accent)]"
                      )}
                    >
                      {r.kind === "builder" ? (
                        <HardHat size={16} />
                      ) : (
                        <Building2 size={16} />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-semibold text-white">
                          {r.kind === "builder" ? r.item.name : r.item.name}
                        </span>
                        {r.kind === "project" && (
                          <StatusBadge status={r.item.status} />
                        )}
                      </span>
                      <span className="mt-0.5 flex items-center gap-1.5 truncate text-[11px] text-[var(--fg-muted)]">
                        {r.kind === "builder" ? (
                          <>Developer · {r.item.cities.join(", ")}</>
                        ) : (
                          <>
                            <span className="font-mono text-[var(--accent)]/90">
                              {r.item.rera}
                            </span>
                            · {r.item.locality}, {r.item.city} ·{" "}
                            {formatINR(r.item.priceMin)}+
                          </>
                        )}
                      </span>
                    </span>
                    <ArrowRight
                      size={15}
                      className={cn(
                        "shrink-0 transition-opacity",
                        i === active
                          ? "opacity-100 text-[var(--accent)]"
                          : "opacity-0"
                      )}
                    />
                  </button>
                </li>
              ))}
              {offerLive && (
                <li className="mt-1 border-t border-white/[0.06] px-2 pt-2">
                  <button
                    onClick={goLive}
                    className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-[12px] font-medium text-[var(--green)] hover:bg-[var(--green)]/[0.1]"
                  >
                    <Radio size={14} className="shrink-0" />
                    <span className="truncate">
                      Look up{" "}
                      <span className="font-mono">{normalizedRera}</span> live on
                      MahaRERA
                    </span>
                    <ArrowRight size={14} className="ml-auto shrink-0" />
                  </button>
                </li>
              )}
              <li className="mt-1 border-t border-white/[0.06] px-3 pt-2">
                <button
                  onClick={() =>
                    router.push(`/search?q=${encodeURIComponent(q.trim())}`)
                  }
                  className="flex w-full items-center justify-between px-2 py-2 text-[12px] font-medium text-[var(--fg-muted)] hover:text-white"
                >
                  <span>See all results for &ldquo;{q}&rdquo;</span>
                  <ArrowRight size={14} />
                </button>
              </li>
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
