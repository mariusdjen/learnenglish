"use client";

import AppShell from "@/components/layout/AppShell";
import HallConjugations from "@/components/hall/HallConjugations";
import HallCommonWords from "@/components/hall/HallCommonWords";
import HallPhrases from "@/components/hall/HallPhrases";
import HallTechVocab from "@/components/hall/HallTechVocab";
import HallMyLife from "@/components/hall/HallMyLife";

const SECTIONS = [
  { id: "conjugaisons", label: "Conjugaisons" },
  { id: "mots", label: "Mots" },
  { id: "phrases", label: "Phrases" },
  { id: "tech", label: "Tech & Pitch" },
  { id: "mylife", label: "Ma vie" },
];

export default function HallPage() {
  return (
    <AppShell activeTab="hall" title="Hall">
      <div className="px-4 py-6 space-y-8">
        {/* Header */}
        <div className="opacity-0 animate-stagger-item" style={{ animationDelay: "0ms" }}>
          <h1 className="text-heading-lg font-bold text-text-primary">Hall</h1>
          <p className="text-body text-text-secondary mt-1">
            Ton espace de reference pour tout retrouver
          </p>
        </div>

        {/* Section navigation pills */}
        <div className="opacity-0 animate-stagger-item" style={{ animationDelay: "80ms" }}>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() =>
                  document
                    .getElementById(s.id)
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="shrink-0 px-4 py-2 text-caption font-semibold rounded-full bg-primary-50 text-primary-700 active:bg-primary-100 transition-colors"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section 1: Conjugations */}
        <section id="conjugaisons">
          <div className="opacity-0 animate-stagger-item" style={{ animationDelay: "160ms" }}>
            <HallConjugations />
          </div>
        </section>

        {/* Section 2: Common words */}
        <section id="mots">
          <div className="opacity-0 animate-stagger-item" style={{ animationDelay: "240ms" }}>
            <HallCommonWords />
          </div>
        </section>

        {/* Section 3: Everyday phrases */}
        <section id="phrases">
          <div className="opacity-0 animate-stagger-item" style={{ animationDelay: "320ms" }}>
            <HallPhrases />
          </div>
        </section>

        {/* Section 4: Tech & Pitch */}
        <section id="tech">
          <div className="opacity-0 animate-stagger-item" style={{ animationDelay: "400ms" }}>
            <HallTechVocab />
          </div>
        </section>

        {/* Section 5: AI My Life */}
        <section id="mylife">
          <div className="opacity-0 animate-stagger-item" style={{ animationDelay: "480ms" }}>
            <HallMyLife />
          </div>
        </section>
      </div>
    </AppShell>
  );
}
