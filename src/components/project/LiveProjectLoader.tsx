"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { SiteNav } from "@/components/SiteNav";
import { SiteFooter } from "@/components/SiteFooter";
import { LiveProjectView, LiveProjectMissing } from "./LiveProjectView";
import type { LookupResult } from "@/lib/maharera";

/**
 * Client-side loader for registration numbers outside the curated set.
 * Fetches the dynamic /api/rera/:rera route so the project page itself can stay
 * statically rendered for the curated projects (no server-side fetch in the
 * page render path). Shows a loading state while the live registry responds.
 */
export function LiveProjectLoader({ rera }: { rera: string }) {
  const [state, setState] = React.useState<
    { status: "loading" } | { status: "done"; result: LookupResult }
  >({ status: "loading" });

  React.useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });
    fetch(`/api/rera/${encodeURIComponent(rera)}`)
      .then((r) => r.json())
      .then((result: LookupResult) => {
        if (!cancelled) setState({ status: "done", result });
      })
      .catch(() => {
        if (!cancelled)
          setState({
            status: "done",
            result: {
              rera,
              provenance: "none",
              attemptedLive: true,
              note: "Couldn’t reach the lookup service. Please try again.",
            },
          });
      });
    return () => {
      cancelled = true;
    };
  }, [rera]);

  if (state.status === "loading") {
    return (
      <>
        <SiteNav />
        <main className="grid min-h-dvh place-items-center px-4">
          <div className="flex flex-col items-center text-center">
            <Loader2 size={28} className="animate-spin text-[var(--accent)]" />
            <p className="mt-4 text-[14px] text-[var(--fg-muted)]">
              Fetching{" "}
              <span className="font-mono text-white">{rera}</span> from the
              MahaRERA registry…
            </p>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  const { result } = state;
  if (result.live && (result.provenance === "live" || result.provenance === "cache")) {
    return (
      <LiveProjectView
        live={result.live}
        provenance={result.provenance}
        fetchedAt={result.fetchedAt}
      />
    );
  }
  return <LiveProjectMissing rera={result.rera} note={result.note} />;
}
