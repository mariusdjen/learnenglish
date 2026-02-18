"use client";

import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "interactive" | "trap" | "success";
}

const variantStyles: Record<NonNullable<CardProps["variant"]>, string> = {
  default:
    "bg-surface-card border border-primary-100 rounded-[1rem] p-4 shadow-[var(--shadow-elevation-1)] transition-all duration-300",
  interactive:
    "bg-surface-card border border-primary-100 rounded-[1rem] p-4 shadow-[var(--shadow-elevation-1)] hover:shadow-[var(--shadow-elevation-2)] hover:-translate-y-0.5 transition-all duration-300 active:scale-[0.98]",
  trap:
    "bg-warm-50 border border-warm-300 rounded-[1rem] p-4 shadow-[var(--shadow-elevation-1)] transition-all duration-300",
  success:
    "bg-accent-50 border border-accent-300 rounded-[1rem] p-4 shadow-[var(--shadow-elevation-1)] transition-all duration-300",
};

export default function Card({
  children,
  className = "",
  variant = "default",
}: CardProps) {
  return (
    <div className={`${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}
