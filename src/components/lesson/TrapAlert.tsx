"use client";

import Card from "@/components/ui/Card";

interface TrapAlertProps {
  trap: {
    id: string;
    wrong_fr: string;
    wrong_en: string;
    correct_en: string;
    explanation: string;
  };
}

export default function TrapAlert({ trap }: TrapAlertProps) {
  return (
    <Card variant="trap">
      <h3 className="text-body-lg font-bold text-warm-500 mb-3">
        Piege francophone !
      </h3>

      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="flex-shrink-0"
          >
            <path
              d="M4 4l8 8M12 4l-8 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="text-error-500"
            />
          </svg>
          <span className="text-body text-error-500 line-through">
            {trap.wrong_en}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="flex-shrink-0"
          >
            <path
              d="M3 8.5l3.5 3.5L13 4"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-accent-600"
            />
          </svg>
          <span className="text-body text-accent-600 font-semibold">
            {trap.correct_en}
          </span>
        </div>
      </div>

      <p className="text-caption text-text-secondary italic">
        ({trap.wrong_fr})
      </p>

      <div className="mt-3 pt-3 border-t border-warm-200">
        <p className="text-caption text-text-secondary leading-relaxed">
          {trap.explanation}
        </p>
      </div>
    </Card>
  );
}
