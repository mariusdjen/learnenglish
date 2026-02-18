"use client";

import { useState } from "react";
import { useNotebookStore } from "@/store/notebook-store";
import AppShell from "@/components/layout/AppShell";
import WordCard from "@/components/notebook/WordCard";
import CorrectionList from "@/components/notebook/CorrectionList";
import ProgressCounter from "@/components/notebook/ProgressCounter";

type NotebookTab = "words" | "corrections";

export default function NotebookPage() {
  const [activeTab, setActiveTab] = useState<NotebookTab>("words");

  const words = useNotebookStore((s) => s.words);
  const corrections = useNotebookStore((s) => s.corrections);
  const removeWord = useNotebookStore((s) => s.removeWord);

  const reviewedWords = words.filter((w) => w.timesReviewed >= 3).length;

  return (
    <AppShell activeTab="notebook" title="Mon carnet">
      <div className="px-4 pt-4 space-y-4">
        {/* Tab switcher */}
        <div className="flex bg-surface-muted rounded-[0.75rem] p-1">
          <button
            type="button"
            onClick={() => setActiveTab("words")}
            className={`flex-1 py-2.5 text-caption font-semibold rounded-[0.5rem] transition-all duration-200 ${
              activeTab === "words"
                ? "bg-surface-card text-primary-700 shadow-sm"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            Mes mots
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("corrections")}
            className={`flex-1 py-2.5 text-caption font-semibold rounded-[0.5rem] transition-all duration-200 ${
              activeTab === "corrections"
                ? "bg-surface-card text-primary-700 shadow-sm"
                : "text-text-muted hover:text-text-secondary"
            }`}
          >
            Corrections
            {corrections.length > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full bg-warm-100 text-warm-500">
                {corrections.length}
              </span>
            )}
          </button>
        </div>

        {/* Words tab */}
        {activeTab === "words" && (
          <div className="space-y-4 animate-fade-in">
            {/* Stats */}
            <ProgressCounter
              totalWords={words.length}
              reviewedWords={reviewedWords}
              totalCorrections={corrections.length}
            />

            {/* Word list */}
            {words.length > 0 ? (
              <div className="space-y-3">
                {words.map((word) => (
                  <WordCard
                    key={word.id}
                    word={word}
                    onRemove={removeWord}
                  />
                ))}
              </div>
            ) : (
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
                    <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                    <path d="M12 6v7" />
                    <path d="M8.5 9.5h7" />
                  </svg>
                </div>
                <p className="text-body font-medium text-text-secondary">
                  Aucun mot sauvegarde
                </p>
                <p className="text-caption text-text-muted mt-1">
                  Sauvegarde des mots pendant tes lecons pour les retrouver ici
                </p>
              </div>
            )}
          </div>
        )}

        {/* Corrections tab */}
        {activeTab === "corrections" && (
          <div className="animate-fade-in">
            <CorrectionList corrections={corrections} />
          </div>
        )}
      </div>
    </AppShell>
  );
}
