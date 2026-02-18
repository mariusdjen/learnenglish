"use client";

import Card from "@/components/ui/Card";

interface MorePhrasesProps {
  phrases: {
    en: string;
    fr: string;
  }[];
}

export default function MorePhrases({ phrases }: MorePhrasesProps) {
  if (phrases.length === 0) return null;

  return (
    <Card>
      <h3 className="text-body font-bold text-text-primary mb-3">
        Autres exemples
      </h3>
      <ul className="space-y-0">
        {phrases.map((phrase, index) => (
          <li
            key={index}
            className={`py-3 opacity-0 animate-stagger-item ${
              index < phrases.length - 1
                ? "border-b border-primary-50"
                : ""
            }`}
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <p className="text-body font-semibold text-text-primary">
              {phrase.en}
            </p>
            <p className="mt-0.5 text-caption text-text-secondary">
              {phrase.fr}
            </p>
          </li>
        ))}
      </ul>
    </Card>
  );
}
