"use client";

import { useState } from "react";
import { getVerbList } from "@/lib/verbs";
import ConjugationTable from "@/components/lesson/ConjugationTable";

const ESSENTIAL_VERB_IDS = ["be", "have", "do", "go", "get", "make", "can", "want"];

export default function HallConjugations() {
  const allVerbs = getVerbList();
  const essentialVerbs = allVerbs.filter((v) => ESSENTIAL_VERB_IDS.includes(v.id));

  const [selectedVerbId, setSelectedVerbId] = useState(essentialVerbs[0]?.id ?? "be");
  const [selectedTenseIndex, setSelectedTenseIndex] = useState(0);

  const selectedVerb = essentialVerbs.find((v) => v.id === selectedVerbId);
  const tenses = selectedVerb?.tenses.filter(
    (t) => t.conjugation["I"] || t.conjugation["you"]
  ) ?? [];
  const selectedTense = tenses[selectedTenseIndex];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-heading font-bold text-text-primary">Conjugaisons</h2>
        <p className="text-caption text-text-secondary mt-1">
          Les verbes essentiels a connaitre
        </p>
      </div>

      {/* Verb selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {essentialVerbs.map((v) => (
          <button
            key={v.id}
            onClick={() => {
              setSelectedVerbId(v.id);
              setSelectedTenseIndex(0);
            }}
            className={`shrink-0 px-3 py-1.5 text-caption font-semibold rounded-full transition-colors ${
              selectedVerbId === v.id
                ? "bg-primary-500 text-white"
                : "bg-surface-muted text-text-secondary"
            }`}
          >
            {v.name_en}
          </button>
        ))}
      </div>

      {/* Tense tabs */}
      {tenses.length > 1 && (
        <div className="flex bg-surface-muted rounded-[0.75rem] p-1">
          {tenses.map((t, i) => (
            <button
              key={t.id}
              onClick={() => setSelectedTenseIndex(i)}
              className={`flex-1 py-2 text-caption font-semibold rounded-[0.5rem] transition-all duration-200 ${
                selectedTenseIndex === i
                  ? "bg-surface-card text-primary-700 shadow-sm"
                  : "text-text-muted"
              }`}
            >
              {t.name_simple}
            </button>
          ))}
        </div>
      )}

      {/* Conjugation table */}
      {selectedTense && (
        <div className="animate-fade-in" key={`${selectedVerbId}-${selectedTense.id}`}>
          <ConjugationTable
            conjugation={selectedTense.conjugation}
            tip={selectedTense.conjugation_tip}
          />
        </div>
      )}
    </div>
  );
}
