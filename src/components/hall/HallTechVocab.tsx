"use client";

import { useState } from "react";
import { TECH_WORDS, TECH_PHRASES } from "@/data/hall/tech-vocabulary";
import { useNotebookStore } from "@/store/notebook-store";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

type ViewMode = "words" | "phrases";

export default function HallTechVocab() {
  const [viewMode, setViewMode] = useState<ViewMode>("words");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { isWordSaved, saveWord } = useNotebookStore();

  const handleSave = (item: { en: string; fr: string }) => {
    saveWord({
      en: item.en,
      fr: item.fr,
      sourceVerbId: "hall",
      sourceDayKey: "tech-vocab",
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-heading font-bold text-text-primary">Tech & Pitch</h2>
        <p className="text-caption text-text-secondary mt-1">
          Le vocabulaire pour presenter tes projets en anglais
        </p>
      </div>

      {/* Toggle words/phrases */}
      <div className="flex bg-surface-muted rounded-[0.75rem] p-1">
        <button
          onClick={() => { setViewMode("words"); setExpandedId(null); }}
          className={`flex-1 py-2 text-caption font-semibold rounded-[0.5rem] transition-all duration-200 ${
            viewMode === "words"
              ? "bg-surface-card text-primary-700 shadow-sm"
              : "text-text-muted"
          }`}
        >
          Vocabulaire
        </button>
        <button
          onClick={() => { setViewMode("phrases"); setExpandedId(null); }}
          className={`flex-1 py-2 text-caption font-semibold rounded-[0.5rem] transition-all duration-200 ${
            viewMode === "phrases"
              ? "bg-surface-card text-primary-700 shadow-sm"
              : "text-text-muted"
          }`}
        >
          Phrases
        </button>
      </div>

      {/* Words view */}
      {viewMode === "words" &&
        TECH_WORDS.map((category) => {
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
                          {word.context && (
                            <p className="text-caption text-text-muted italic mt-0.5">
                              {word.context}
                            </p>
                          )}
                        </div>
                        {saved ? (
                          <div className="flex-shrink-0 ml-3 flex items-center justify-center w-10 h-10">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
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
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
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

      {/* Phrases view */}
      {viewMode === "phrases" &&
        TECH_PHRASES.map((category) => {
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
                  <Badge variant="muted">{category.phrases.length}</Badge>
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
                  {category.phrases.map((phrase) => {
                    const saved = isWordSaved(phrase.en);

                    return (
                      <li
                        key={phrase.en}
                        className="flex items-center justify-between py-3 border-b border-primary-50 last:border-b-0"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-body font-semibold text-primary-700">
                            {phrase.fr}
                          </p>
                          <p className="text-caption text-text-secondary mt-0.5">
                            {phrase.en}
                          </p>
                        </div>
                        {saved ? (
                          <div className="flex-shrink-0 ml-3 flex items-center justify-center w-10 h-10">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
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
                              onClick={() => handleSave(phrase)}
                              className="w-10 h-10 !p-0 !min-h-0"
                            >
                              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
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
