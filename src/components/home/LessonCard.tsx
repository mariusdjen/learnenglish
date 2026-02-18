"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";

interface LessonCardProps {
  verbName: string;
  tenseName: string;
  dayLabel: string;
  isMorning: boolean;
  isEvening: boolean;
}

export default function LessonCard({
  verbName,
  tenseName,
  dayLabel,
  isMorning,
  isEvening,
}: LessonCardProps) {
  const sessionLabel = isMorning
    ? "Matin : Decouverte"
    : isEvening
      ? "Soir : Exercices"
      : "Session disponible";

  const sessionIcon = isMorning ? (
    // Sun icon for morning
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="5" stroke="#3B82F6" strokeWidth="2" />
      <path
        d="M12 2V4M12 20V22M4 12H2M22 12H20M5.64 5.64L4.22 4.22M19.78 4.22L18.36 5.64M5.64 18.36L4.22 19.78M19.78 19.78L18.36 18.36"
        stroke="#3B82F6"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  ) : (
    // Moon icon for evening
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M21 12.79A9 9 0 1111.21 3a7 7 0 009.79 9.79z"
        stroke="#3B82F6"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  return (
    <Link href="/lesson" className="block animate-slide-up">
      <Card variant="interactive" className="bg-gradient-to-br from-primary-50 to-primary-100/50 border-primary-200 shadow-[var(--shadow-elevation-2)]">
        {/* Session time indicator */}
        <div className="flex items-center gap-2 mb-3">
          {sessionIcon}
          <span className="text-caption font-semibold text-primary-600">
            {sessionLabel}
          </span>
        </div>

        {/* Verb name */}
        <h2 className="text-heading-lg font-bold text-text-primary mb-1">
          {verbName}
        </h2>

        {/* Tense */}
        <p className="text-body text-text-secondary mb-3">{tenseName}</p>

        {/* Day label */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center rounded-pill bg-primary-100 px-3 py-1 text-caption font-medium text-primary-700">
            {dayLabel}
          </span>

          {/* Arrow */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="#3B82F6"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Card>
    </Link>
  );
}
