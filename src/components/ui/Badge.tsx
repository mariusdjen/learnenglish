"use client";

import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "accent" | "warm" | "muted";
}

const variantStyles: Record<NonNullable<BadgeProps["variant"]>, string> = {
  default: "bg-primary-100 text-primary-700",
  accent: "bg-accent-100 text-accent-600",
  warm: "bg-warm-100 text-warm-500",
  muted: "bg-surface-muted text-text-muted",
};

export default function Badge({
  children,
  className = "",
  variant = "default",
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold animate-fade-in ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
