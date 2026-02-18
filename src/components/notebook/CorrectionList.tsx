"use client";

import type { Correction } from "@/types/notebook";
import Card from "@/components/ui/Card";

interface CorrectionListProps {
  corrections: Correction[];
}

function formatDate(isoDate: string): string {
  const date = new Date(isoDate);
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function CorrectionCard({ correction }: { correction: Correction }) {
  return (
    <Card className="animate-fade-in">
      <div className="space-y-2">
        {/* Original vs corrected */}
        <div className="space-y-1">
          <p className="text-body">
            <span className="line-through text-warm-400">{correction.original}</span>
          </p>
          <p className="text-body font-semibold text-accent-600">
            {correction.corrected}
          </p>
        </div>

        {/* Explanation */}
        <p className="text-caption text-text-secondary leading-relaxed">
          {correction.explanation}
        </p>

        {/* Date and verb */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-caption text-text-muted">
            {formatDate(correction.date)}
          </span>
          {correction.verbRelated && (
            <span className="text-xs text-primary-500 font-medium">
              {correction.verbRelated}
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function CorrectionList({ corrections }: CorrectionListProps) {
  if (corrections.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-surface-muted flex items-center justify-center mb-4">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-muted"
          >
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
        </div>
        <p className="text-body font-medium text-text-secondary">
          Pas encore de corrections
        </p>
        <p className="text-caption text-text-muted mt-1">
          Tes corrections du chat apparaitront ici
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {corrections.map((correction) => (
        <CorrectionCard key={correction.id} correction={correction} />
      ))}
    </div>
  );
}
