"use client";

interface DayProgressProps {
  completedDays: string[];
  currentDayKey: string;
}

const STEPS = ["J1", "J2", "J4", "J7"];

export default function DayProgress({
  completedDays,
  currentDayKey,
}: DayProgressProps) {
  return (
    <div className="flex items-center justify-center w-full px-4">
      {STEPS.map((step, index) => {
        const isCompleted = completedDays.includes(step);
        const isCurrent = step === currentDayKey;
        const isLast = index === STEPS.length - 1;

        return (
          <div key={step} className="flex items-center">
            {/* Step circle and label */}
            <div className="flex flex-col items-center opacity-0 animate-stagger-item" style={{ animationDelay: `${index * 100}ms` }}>
              <div
                className={`
                  w-9 h-9 rounded-full flex items-center justify-center text-caption font-bold transition-colors
                  ${
                    isCompleted
                      ? "bg-accent-500 text-white"
                      : isCurrent
                        ? "bg-primary-500 text-white animate-pulse"
                        : "bg-surface-muted text-text-muted border border-primary-100"
                  }
                `}
              >
                {isCompleted ? (
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M3.5 8.5l3 3L12.5 4.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <span>{step}</span>
                )}
              </div>
              <span
                className={`mt-1 text-caption ${
                  isCompleted
                    ? "text-accent-600 font-semibold"
                    : isCurrent
                      ? "text-primary-600 font-semibold"
                      : "text-text-muted"
                }`}
              >
                {step}
              </span>
            </div>

            {/* Connecting line */}
            {!isLast && (
              <div
                className={`
                  w-8 h-0.5 mx-1 mt-[-1.25rem]
                  ${
                    isCompleted && completedDays.includes(STEPS[index + 1])
                      ? "bg-accent-400"
                      : isCompleted
                        ? "bg-accent-200"
                        : "bg-primary-100"
                  }
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
