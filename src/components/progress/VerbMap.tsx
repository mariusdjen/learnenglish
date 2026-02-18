"use client";

import type { VerbData } from "@/types/verb";
import type { VerbProgressData } from "@/types/progress";
import VerbTile from "@/components/progress/VerbTile";

interface VerbMapProps {
  verbs: VerbData[];
  verbProgress: Record<string, VerbProgressData>;
}

export default function VerbMap({ verbs, verbProgress }: VerbMapProps) {
  const masteredCount = verbs.filter(
    (v) => verbProgress[v.id]?.status === "mastered"
  ).length;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-heading font-bold text-text-primary">
          Les 20 verbes Pareto
        </h2>
        <span className="inline-flex items-center rounded-full bg-accent-100 px-3 py-1 text-caption font-semibold text-accent-600">
          {masteredCount}/{verbs.length}
        </span>
      </div>

      {/* Verb grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {verbs.map((verb, index) => {
          const progress = verbProgress[verb.id];
          const status = progress?.status ?? "locked";
          const tenseProgress = progress?.tenseProgress;

          return (
            <div
              key={verb.id}
              style={{ animationDelay: `${index * 40}ms` }}
              className="opacity-0 animate-stagger-item"
            >
              <VerbTile
                verb={verb}
                status={status}
                tenseProgress={tenseProgress}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
