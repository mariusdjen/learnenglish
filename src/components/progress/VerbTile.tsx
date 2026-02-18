"use client";

import type { VerbData } from "@/types/verb";
import type { TenseProgressData } from "@/types/progress";
import Card from "@/components/ui/Card";

interface VerbTileProps {
  verb: VerbData;
  status: "locked" | "active" | "mastered";
  tenseProgress?: Record<string, TenseProgressData>;
}

function LockIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-text-muted"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-accent-500"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function PulsingDot() {
  return (
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-500" />
    </span>
  );
}

export default function VerbTile({ verb, status, tenseProgress }: VerbTileProps) {
  // Count mastered tenses out of total
  const totalTenses = verb.tenses.length;
  const masteredTenses = tenseProgress
    ? Object.values(tenseProgress).filter((t) => t.status === "mastered").length
    : 0;

  if (status === "locked") {
    return (
      <Card className="opacity-50 bg-surface-muted border-surface-muted">
        <div className="flex flex-col items-center text-center py-2 gap-2">
          <LockIcon />
          <p className="text-caption font-medium text-text-muted truncate w-full">
            {verb.name_en}
          </p>
          <span className="text-xs text-text-muted">{verb.name_fr}</span>
        </div>
      </Card>
    );
  }

  if (status === "mastered") {
    return (
      <Card className="bg-gradient-to-br from-accent-50 to-accent-100/50 border-accent-200 shadow-[var(--shadow-elevation-1)] hover:shadow-[var(--shadow-elevation-2)] hover:-translate-y-0.5 transition-all duration-300">
        <div className="flex flex-col items-center text-center py-2 gap-2">
          <CheckIcon />
          <p className="text-caption font-semibold text-accent-600 truncate w-full">
            {verb.name_en}
          </p>
          <span className="inline-flex items-center rounded-full bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-600">
            {masteredTenses}/{totalTenses}
          </span>
        </div>
      </Card>
    );
  }

  // Active
  return (
    <Card className="bg-gradient-to-br from-primary-50 to-primary-100/50 border-primary-200 shadow-[var(--shadow-elevation-1)] hover:shadow-[var(--shadow-elevation-2)] hover:-translate-y-0.5 transition-all duration-300">
      <div className="flex flex-col items-center text-center py-2 gap-2">
        <PulsingDot />
        <p className="text-caption font-semibold text-primary-700 truncate w-full">
          {verb.name_en}
        </p>
        <span className="inline-flex items-center rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-700">
          {masteredTenses}/{totalTenses}
        </span>
      </div>
    </Card>
  );
}
