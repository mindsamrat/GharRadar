import * as React from "react";
import { cn } from "@/lib/utils";
import { STATUS_META, type ProjectStatus } from "@/data/rera";

export function Badge({
  className,
  color,
  bg,
  children,
}: {
  className?: string;
  color?: string;
  bg?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold",
        className
      )}
      style={{
        color: color ?? "var(--fg-muted)",
        background: bg ?? "rgba(255,255,255,0.05)",
      }}
    >
      {children}
    </span>
  );
}

export function StatusBadge({
  status,
  className,
}: {
  status: ProjectStatus;
  className?: string;
}) {
  const meta = STATUS_META[status];
  return (
    <Badge color={meta.color} bg={meta.bg} className={className}>
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: meta.dot }}
      />
      {meta.label}
    </Badge>
  );
}
