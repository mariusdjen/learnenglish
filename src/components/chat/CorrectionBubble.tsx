"use client";

interface CorrectionBubbleProps {
  correction: {
    original: string;
    corrected: string;
    explanation: string;
  };
}

export default function CorrectionBubble({
  correction,
}: CorrectionBubbleProps) {
  return (
    <div className="bg-warm-50 border-l-4 border-warm-500 rounded-[1rem] rounded-bl-sm px-4 py-3 shadow-[var(--shadow-elevation-2)]">
      {/* Title row */}
      <div className="flex items-center gap-2 mb-2">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-warm-500 shrink-0"
        >
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          <path d="m15 5 4 4" />
        </svg>
        <span className="text-caption font-semibold text-warm-500">
          Petite correction
        </span>
      </div>

      {/* Original - struck through */}
      <p className="text-body text-text-secondary line-through mb-1">
        {correction.original}
      </p>

      {/* Corrected - bold green */}
      <p className="text-body font-bold text-accent-600 mb-2">
        {correction.corrected}
      </p>

      {/* Explanation - italic, smaller */}
      <p className="text-caption italic text-text-secondary">
        {correction.explanation}
      </p>
    </div>
  );
}
