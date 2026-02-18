"use client";

import { useState } from "react";
import { COMMON_WORDS } from "@/data/hall/common-words";
import { useNotebookStore } from "@/store/notebook-store";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

export default function HallCommonWords() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { isWordSaved, saveWord } = useNotebookStore();

  const handleSave = (word: { en: string; fr: string }) => {
    saveWord({
      en: word.en,
      fr: word.fr,
      sourceVerbId: "hall",
      sourceDayKey: "common-words",
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-heading font-bold text-text-primary">Mots essentiels</h2>
        <p className="text-caption text-text-secondary mt-1">
          Les 100 mots anglais les plus utilises
        </p>
      </div>

      {COMMON_WORDS.map((category) => {
        const isExpanded = expandedId === category.id;

        return (
          <Card key={category.id} variant="interactive">
            <button
              type="button"
              className="w-full flex items-center justify-between"
              onClick={() => setExpandedId(isExpanded ? null : category.id)}
            >
              <div className="flex items-center gap-2">
                <span className="text-body font-bold text-text-primary">
                  {category.label}
                </span>
                <Badge variant="muted">{category.words.length}</Badge>
              </div>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className={`text-text-muted transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              >
                <path
                  d="M5 7.5l5 5 5-5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {isExpanded && (
              <ul className="mt-3 space-y-0 animate-fade-in">
                {category.words.map((word) => {
                  const saved = isWordSaved(word.en);

                  return (
                    <li
                      key={word.en}
                      className="flex items-center justify-between py-2.5 border-b border-primary-50 last:border-b-0"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-body font-semibold text-text-primary">
                          {word.en}
                        </p>
                        <p className="text-caption text-text-secondary">{word.fr}</p>
                      </div>

                      {saved ? (
                        <div className="flex-shrink-0 ml-3 flex items-center justify-center w-10 h-10">
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                            aria-label="Sauvegarde"
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
            )}
          </Card>
        );
      })}
    </div>
  );
}
