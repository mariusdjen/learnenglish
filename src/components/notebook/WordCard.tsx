"use client";

import type { SavedWord } from "@/types/notebook";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface WordCardProps {
  word: SavedWord;
  onRemove: (id: string) => void;
}

function XIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6L6 18" />
      <path d="M6 6l12 12" />
    </svg>
  );
}

export default function WordCard({ word, onRemove }: WordCardProps) {
  const needsReview = word.timesReviewed < 3;

  return (
    <Card
      className={`animate-fade-in relative ${
        needsReview ? "border-warm-200 bg-warm-50/30" : ""
      }`}
    >
      {needsReview && (
        <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-warm-400 animate-pulse" />
      )}
      <div className="flex items-start justify-between gap-3">
        {/* Word content */}
        <div className="flex-1 min-w-0">
          <p className="text-body font-bold text-primary-700">{word.en}</p>
          <p className="text-caption text-text-secondary mt-0.5">{word.fr}</p>

          <div className="flex items-center gap-2 mt-2">
            <Badge variant="muted" className="text-xs">
              {word.sourceVerbId}
            </Badge>
            {needsReview && (
              <span className="text-xs text-warm-400 font-medium">
                A revoir ({word.timesReviewed}/3)
              </span>
            )}
          </div>
        </div>

        {/* Delete button */}
        <button
          type="button"
          onClick={() => onRemove(word.id)}
          className="flex items-center justify-center w-8 h-8 rounded-full text-text-muted hover:text-error-400 hover:bg-error-50 transition-colors shrink-0"
          aria-label={`Supprimer ${word.en}`}
        >
          <XIcon />
        </button>
      </div>
    </Card>
  );
}
