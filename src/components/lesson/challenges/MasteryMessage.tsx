"use client";

import Button from "@/components/ui/Button";

interface MasteryMessageProps {
  message: string;
  verbName: string;
  onContinue?: () => void;
}

export default function MasteryMessage({
  message,
  verbName,
  onContinue,
}: MasteryMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-10 animate-fade-in">
      {/* Animated star icon */}
      <div className="animate-bounce-in mb-6">
        <div className="w-20 h-20 rounded-full bg-accent-100 flex items-center justify-center">
          <svg
            width="44"
            height="44"
            viewBox="0 0 44 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M22 4L27.09 14.36L38.5 16.03L30.25 24.06L32.18 35.44L22 30.09L11.82 35.44L13.75 24.06L5.5 16.03L16.91 14.36L22 4Z"
              fill="var(--color-accent-400)"
              stroke="var(--color-accent-500)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Verb name */}
      <p className="text-caption text-text-muted uppercase tracking-wide font-semibold mb-2">
        {verbName}
      </p>

      {/* Mastery message */}
      <h2 className="text-heading font-bold text-text-primary mb-2">
        Bravo !
      </h2>
      <p className="text-body-lg text-text-secondary leading-relaxed max-w-sm">
        {message}
      </p>

      {/* Continue button */}
      {onContinue && (
        <div className="mt-8 w-full max-w-xs">
          <Button
            variant="primary"
            size="lg"
            onClick={onContinue}
            className="w-full"
          >
            Continuer
          </Button>
        </div>
      )}
    </div>
  );
}
