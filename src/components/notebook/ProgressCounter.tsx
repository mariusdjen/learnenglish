"use client";

interface ProgressCounterProps {
  totalWords: number;
  reviewedWords: number;
  totalCorrections: number;
}

function StatItem({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center flex-1">
      <span className="text-heading font-bold text-text-primary">{value}</span>
      <span className="text-caption text-text-muted text-center">{label}</span>
    </div>
  );
}

export default function ProgressCounter({
  totalWords,
  reviewedWords,
  totalCorrections,
}: ProgressCounterProps) {
  return (
    <div className="flex items-center justify-around py-4 px-2 bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100 rounded-[1rem] shadow-[var(--shadow-elevation-1)] animate-fade-in">
      <StatItem value={totalWords} label="Mots sauves" />
      <div className="w-px h-10 bg-surface-muted" />
      <StatItem value={reviewedWords} label="Revises" />
      <div className="w-px h-10 bg-surface-muted" />
      <StatItem value={totalCorrections} label="Corrections" />
    </div>
  );
}
