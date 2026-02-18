"use client";

import { useState, useEffect } from "react";

interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

function getColorClass(value: number): string {
  if (value < 33) return "text-warm-500";
  if (value <= 66) return "text-primary-500";
  return "text-accent-500";
}

export default function ProgressRing({
  value,
  size = 64,
  strokeWidth = 6,
  className = "",
}: ProgressRingProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Animate from 0 to target value on mount / value change
    const frame = requestAnimationFrame(() => {
      setDisplayValue(clampedValue);
    });
    return () => cancelAnimationFrame(frame);
  }, [clampedValue]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (displayValue / 100) * circumference;
  const center = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="progressbar"
      aria-valuenow={clampedValue}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Background track */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-surface-muted"
      />
      {/* Foreground progress */}
      <circle
        cx={center}
        cy={center}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        className={`${getColorClass(clampedValue)} transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]`}
        style={{
          strokeDasharray: circumference,
          strokeDashoffset,
          transform: "rotate(-90deg)",
          transformOrigin: "center",
        }}
      />
      {/* Center text */}
      <text
        x={center}
        y={center}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-text-primary text-caption font-semibold"
        style={{ fontSize: size * 0.24 }}
      >
        {Math.round(clampedValue)}%
      </text>
    </svg>
  );
}
