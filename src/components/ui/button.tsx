import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "outline";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none select-none";

const variants: Record<Variant, string> = {
  primary:
    "text-white shadow-[0_8px_30px_-8px_rgba(255,106,43,0.6)] bg-[linear-gradient(100deg,#ff6a2b,#ff2d6f)] hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "bg-white/[0.06] text-white border border-white/10 hover:bg-white/[0.1] hover:border-white/20",
  ghost: "text-[var(--fg-muted)] hover:text-white hover:bg-white/[0.05]",
  outline:
    "border border-[var(--accent)]/40 text-[var(--accent)] hover:bg-[var(--accent)]/10",
};

const sizes: Record<Size, string> = {
  sm: "text-xs px-3.5 py-2",
  md: "text-sm px-5 py-2.5",
  lg: "text-[15px] px-7 py-3.5",
};

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}

interface ButtonLinkProps
  extends React.ComponentProps<typeof Link> {
  variant?: Variant;
  size?: Size;
}

export function ButtonLink({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  );
}
