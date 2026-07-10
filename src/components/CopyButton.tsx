"use client";

import * as React from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function CopyButton({
  value,
  className,
  label,
}: {
  value: string;
  className?: string;
  label?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1600);
        } catch {
          /* clipboard unavailable */
        }
      }}
      className={cn(
        "inline-flex items-center gap-1.5 transition-colors",
        className
      )}
      aria-label={`Copy ${label ?? value}`}
    >
      {copied ? (
        <>
          <Check size={13} className="text-[var(--green)]" />
          <span className="text-[var(--green)]">Copied</span>
        </>
      ) : (
        <>
          <Copy size={13} />
          {label ?? "Copy"}
        </>
      )}
    </button>
  );
}
