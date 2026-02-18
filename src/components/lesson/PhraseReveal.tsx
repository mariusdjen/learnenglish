"use client";

import Card from "@/components/ui/Card";

interface PhraseRevealProps {
  phrase: {
    en: string;
    fr: string;
  };
}

export default function PhraseReveal({ phrase }: PhraseRevealProps) {
  return (
    <Card className="bg-primary-50 animate-fade-in border-l-4 border-primary-400 shadow-[var(--shadow-elevation-2)]">
      <p className="text-heading-lg font-bold text-primary-700 leading-tight">
        {phrase.en}
      </p>
      <p className="mt-2 text-body text-text-secondary">
        {phrase.fr}
      </p>
    </Card>
  );
}
