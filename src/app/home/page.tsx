"use client";

import AppShell from "@/components/layout/AppShell";
import StreakBadge from "@/components/home/StreakBadge";
import LessonCard from "@/components/home/LessonCard";
import AiFriendCard from "@/components/home/AiFriendCard";
import NotebookCard from "@/components/home/NotebookCard";
import { useCurrentLesson } from "@/hooks/useCurrentLesson";
import { useStreak } from "@/hooks/useStreak";
import { useNotebook } from "@/hooks/useNotebook";
import { useTimeOfDay } from "@/hooks/useTimeOfDay";

/** Map DayKey values to human-readable French labels */
function getDayLabel(dayKey: string | null): string {
  if (!dayKey) return "";
  const labels: Record<string, string> = {
    J1_discovery: "Jour 1 - Decouverte",
    J1_evening: "Jour 1 - Soir",
    J2_challenge: "Jour 2 - Defi",
    J2_evening: "Jour 2 - Soir",
    J4_recall: "Jour 4 - Rappel",
    J4_evening: "Jour 4 - Soir",
    J7_mastery: "Jour 7 - Maitrise",
    J7_evening: "Jour 7 - Soir",
  };
  return labels[dayKey] ?? dayKey;
}

export default function HomePage() {
  const { verb, tense, dayKey, isMorning, isEvening, isLoading } =
    useCurrentLesson();
  const { streakDays, isActiveToday } = useStreak();
  const { words, corrections } = useNotebook();
  const { isMorning: isMorningTime } = useTimeOfDay();

  const greeting = isMorningTime ? "Bonjour" : "Bonsoir";
  const encouragement = isMorningTime
    ? "Pret pour une nouvelle lecon ?"
    : "On revise ce soir ?";

  return (
    <AppShell activeTab="lesson" title="English avec Marius">
      <div className="px-4 py-6 space-y-5">
        {/* Greeting */}
        <div className="opacity-0 animate-stagger-item" style={{ animationDelay: '0ms' }}>
          <h1 className="text-heading-lg font-bold text-text-primary">
            {greeting} !
          </h1>
          <p className="text-body text-text-secondary mt-1">{encouragement}</p>
        </div>

        {/* Streak badge */}
        <div className="opacity-0 animate-stagger-item" style={{ animationDelay: '80ms' }}>
          <StreakBadge streakDays={streakDays} isActiveToday={isActiveToday} />
        </div>

        {/* Lesson card */}
        {!isLoading && verb && tense && (
          <div className="opacity-0 animate-stagger-item" style={{ animationDelay: '160ms' }}>
            <LessonCard
              verbName={verb.name_en}
              tenseName={tense.name_simple}
              dayLabel={getDayLabel(dayKey)}
              isMorning={isMorning}
              isEvening={isEvening}
            />
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="opacity-0 animate-stagger-item flex items-center justify-center py-8" style={{ animationDelay: '160ms' }}>
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-200 border-t-primary-500" />
          </div>
        )}

        {/* AI friend card */}
        <div className="opacity-0 animate-stagger-item" style={{ animationDelay: '240ms' }}>
          <AiFriendCard />
        </div>

        {/* Notebook card */}
        <div className="opacity-0 animate-stagger-item" style={{ animationDelay: '320ms' }}>
          <NotebookCard
            wordCount={words.length}
            correctionCount={corrections.length}
          />
        </div>
      </div>
    </AppShell>
  );
}
