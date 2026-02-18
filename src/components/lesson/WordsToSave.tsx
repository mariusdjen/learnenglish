"use client";

import { useNotebook } from "@/hooks/useNotebook";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

interface WordsToSaveProps {
  words: {
    en: string;
    fr: string;
  }[];
  verbId: string;
  dayKey: string;
}

export default function WordsToSave({
  words,
  verbId,
  dayKey,
}: WordsToSaveProps) {
  const { isWordSaved, saveWord } = useNotebook();

  if (words.length === 0) return null;

  const handleSave = (word: { en: string; fr: string }) => {
    saveWord({
      en: word.en,
      fr: word.fr,
      sourceVerbId: verbId,
      sourceDayKey: dayKey,
    });
  };

  return (
    <Card>
      <h3 className="text-body font-bold text-text-primary mb-3">
        Mots a retenir
      </h3>
      <ul className="space-y-0">
        {words.map((word, index) => {
          const saved = isWordSaved(word.en);

          return (
            <li
              key={index}
              className={`flex items-center justify-between py-3 opacity-0 animate-stagger-item ${
                index < words.length - 1
                  ? "border-b border-primary-50"
                  : ""
              }`}
              style={{ animationDelay: `${index * 60}ms` }}
            >
              <div className="min-w-0 flex-1">
                <p className="text-body font-semibold text-text-primary">
                  {word.en}
                </p>
                <p className="text-caption text-text-secondary">
                  {word.fr}
                </p>
              </div>

              {saved ? (
                <div className="flex-shrink-0 ml-3 flex items-center justify-center w-10 h-10">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Deja sauvegarde"
                  >
                    <path
                      d="M4 10.5l4.5 4.5L16 5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-accent-500"
                    />
                  </svg>
                </div>
              ) : (
                <div className="flex-shrink-0 ml-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSave(word)}
                    className="w-10 h-10 !p-0 !min-h-0"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-label="Sauvegarder"
                    >
                      <path
                        d="M10 4v12M4 10h12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </Button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
