"use client";

interface StreakBadgeProps {
  streakDays: number;
  isActiveToday: boolean;
}

export default function StreakBadge({
  streakDays,
  isActiveToday,
}: StreakBadgeProps) {
  const message =
    streakDays === 0
      ? "Commence ta serie !"
      : isActiveToday
        ? "En forme aujourd'hui !"
        : "Continue ta serie !";

  const bgClass = isActiveToday
    ? "bg-accent-50 border-accent-300 shadow-[var(--shadow-elevation-1)]"
    : "bg-surface-muted border-primary-100";

  const flameColor = isActiveToday ? "#22C55E" : "#94A3B8";

  return (
    <div
      className={`flex items-center gap-3 rounded-pill border px-4 py-2.5 animate-fade-in ${bgClass}`}
    >
      {/* Flame icon */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M12 2C12 2 6.5 9 6.5 13.5C6.5 17.09 8.91 20 12 20C15.09 20 17.5 17.09 17.5 13.5C17.5 9 12 2 12 2ZM12 18C9.79 18 8 16.21 8 14C8 11.36 10.5 7.8 12 5.68C13.5 7.8 16 11.36 16 14C16 16.21 14.21 18 12 18ZM10.5 14C10.5 15.38 11.12 16 12 16C12.55 16 13 15.55 13 15C13 14.45 12.55 14 12 14C11.17 14 10.5 13.33 10.5 14Z"
          fill={flameColor}
        />
      </svg>

      {/* Streak count */}
      <div className="flex flex-col">
        <span className="text-body font-bold text-text-primary">
          {streakDays} {streakDays <= 1 ? "jour" : "jours"}
        </span>
        <span className="text-caption text-text-secondary">{message}</span>
      </div>
    </div>
  );
}
