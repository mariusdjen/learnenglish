"use client";

interface ProgressBarProps {
  value: number;
  className?: string;
  color?: "primary" | "accent";
}

const colorStyles: Record<NonNullable<ProgressBarProps["color"]>, string> = {
  primary: "bg-primary-500 shadow-[0_0_6px_rgba(59,130,246,0.3)]",
  accent: "bg-accent-500 shadow-[0_0_6px_rgba(34,197,94,0.3)]",
};

export default function ProgressBar({
  value,
  className = "",
  color = "primary",
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div
      className={`w-full h-3 rounded-full bg-surface-muted overflow-hidden ${className}`}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${colorStyles[color]}`}
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
}
