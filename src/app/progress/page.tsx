"use client";

import { useUserProgressStore } from "@/store/user-progress";
import { getVerbList } from "@/lib/verbs";
import AppShell from "@/components/layout/AppShell";
import VerbMap from "@/components/progress/VerbMap";

export default function ProgressPage() {
  const verbProgress = useUserProgressStore((s) => s.verbProgress);
  const streakDays = useUserProgressStore((s) => s.streakDays);
  const verbs = getVerbList();

  const masteredVerbs = verbs.filter(
    (v) => verbProgress[v.id]?.status === "mastered"
  ).length;
  const activeVerbs = verbs.filter(
    (v) => verbProgress[v.id]?.status === "active"
  ).length;

  return (
    <AppShell activeTab="lesson" title="Ma progression" showBack>
      <div className="px-4 pt-4 space-y-6 pb-8">
        {/* Summary stats */}
        <div className="flex items-center justify-around py-5 px-2 bg-gradient-to-r from-primary-50 to-accent-50 border border-primary-100 rounded-[1rem] shadow-[var(--shadow-elevation-2)] animate-slide-up">
          <div className="flex flex-col items-center">
            <span className="text-heading-lg font-bold text-primary-700">
              {streakDays}
            </span>
            <span className="text-caption text-text-muted">Jours de suite</span>
          </div>
          <div className="w-px h-10 bg-surface-muted" />
          <div className="flex flex-col items-center">
            <span className="text-heading-lg font-bold text-accent-600">
              {masteredVerbs}
            </span>
            <span className="text-caption text-text-muted">Maitrises</span>
          </div>
          <div className="w-px h-10 bg-surface-muted" />
          <div className="flex flex-col items-center">
            <span className="text-heading-lg font-bold text-warm-500">
              {activeVerbs}
            </span>
            <span className="text-caption text-text-muted">En cours</span>
          </div>
        </div>

        {/* Verb map */}
        <VerbMap verbs={verbs} verbProgress={verbProgress} />
      </div>
    </AppShell>
  );
}
