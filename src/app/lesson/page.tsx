"use client";

import { useCallback } from "react";
import { useCurrentLesson } from "@/hooks/useCurrentLesson";
import { useUserProgressStore } from "@/store/user-progress";

import type {
  DayDiscovery,
  DayChallenge,
  DayRecall,
  DayMastery,
  DayEvening,
  DayChallengeEvening,
  DayRecallEvening,
  DayMasteryEvening,
} from "@/types/verb";

import AppShell from "@/components/layout/AppShell";
import PhraseReveal from "@/components/lesson/PhraseReveal";
import SituationContext from "@/components/lesson/SituationContext";
import ConjugationTable from "@/components/lesson/ConjugationTable";
import TrapAlert from "@/components/lesson/TrapAlert";
import MemoTip from "@/components/lesson/MemoTip";
import MorePhrases from "@/components/lesson/MorePhrases";
import WordsToSave from "@/components/lesson/WordsToSave";
import DayProgress from "@/components/lesson/DayProgress";
import ChallengeRunner from "@/components/lesson/challenges/ChallengeRunner";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

// ── Morning content types ─────────────────────────────────────
type MorningContent = DayDiscovery | DayChallenge | DayRecall | DayMastery;
type EveningContent =
  | DayEvening
  | DayChallengeEvening
  | DayRecallEvening
  | DayMasteryEvening;

// ── Type guards ───────────────────────────────────────────────
function isMorningContent(content: unknown): content is MorningContent {
  return (
    typeof content === "object" &&
    content !== null &&
    "phrase" in content &&
    "situation" in content
  );
}

function isEveningContent(content: unknown): content is EveningContent {
  return (
    typeof content === "object" &&
    content !== null &&
    "challenge" in content
  );
}

function hasReveal(content: MorningContent): content is DayDiscovery {
  return "reveal" in content;
}

// ── Lesson Page ───────────────────────────────────────────────

export default function LessonPage() {
  const { verb, tense, dayKey, dayContent, isMorning, isEvening, isLoading } =
    useCurrentLesson();

  const { completeDay, advanceToNextDay, updateStreak } =
    useUserProgressStore();

  const verbProgress = useUserProgressStore((s) => s.verbProgress);
  const currentVerbId = useUserProgressStore((s) => s.currentVerbId);

  const tenseId = tense?.id ?? "";
  const completedDays =
    verbProgress[currentVerbId]?.tenseProgress[tenseId]?.completedDays ?? [];

  // ── Handlers ──────────────────────────────────────────────
  const handleChallengeComplete = useCallback(
    (score: number, total: number) => {
      if (!verb || !tense || !dayKey) return;
      completeDay(verb.id, tense.id, dayKey, score, total);
      updateStreak();
      advanceToNextDay();
    },
    [verb, tense, dayKey, completeDay, updateStreak, advanceToNextDay],
  );

  const handleMorningComplete = useCallback(() => {
    if (!verb || !tense || !dayKey) return;
    completeDay(verb.id, tense.id, dayKey, 0, 0);
    updateStreak();
    advanceToNextDay();
  }, [verb, tense, dayKey, completeDay, updateStreak, advanceToNextDay]);

  // ── Loading state ─────────────────────────────────────────
  if (isLoading) {
    return (
      <AppShell activeTab="lesson" title="Lecon">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-3 border-primary-200 border-t-primary-500 rounded-full animate-spin" />
        </div>
      </AppShell>
    );
  }

  // ── No content ────────────────────────────────────────────
  if (!verb || !tense || !dayContent || !dayKey) {
    return (
      <AppShell activeTab="lesson" title="Lecon">
        <div className="flex flex-col items-center justify-center h-64 text-center px-6">
          <p className="text-body text-text-secondary">
            Aucune lecon disponible pour le moment.
          </p>
          <p className="text-caption text-text-muted mt-2">
            Reviens plus tard ou termine l&apos;onboarding.
          </p>
        </div>
      </AppShell>
    );
  }

  // ── Morning lesson ────────────────────────────────────────
  if (isMorning && isMorningContent(dayContent)) {
    const morning = dayContent;
    const dayLabel = dayKey.startsWith("J1")
      ? "Jour 1"
      : dayKey.startsWith("J2")
        ? "Jour 2"
        : dayKey.startsWith("J4")
          ? "Jour 4"
          : "Jour 7";

    return (
      <AppShell
        activeTab="lesson"
        title={`${verb.name_en.toUpperCase()} - ${tense.name_simple}`}
        showBack
      >
        <div className="px-4 py-6 space-y-5">
          {/* Day progress indicator */}
          <div className="opacity-0 animate-stagger-item" style={{ animationDelay: '0ms' }}>
            <DayProgress completedDays={completedDays} currentDayKey={dayKey} />
          </div>

          {/* Day title */}
          <div className="opacity-0 animate-stagger-item" style={{ animationDelay: '80ms' }}>
            <div className="text-center">
              <span className="text-caption font-semibold text-primary-500 uppercase tracking-wide">
                {dayLabel} - {morning.title}
              </span>
            </div>
          </div>

          {/* Main phrase */}
          <div className="opacity-0 animate-stagger-item" style={{ animationDelay: '160ms' }}>
            <PhraseReveal phrase={morning.phrase} />
          </div>

          {/* Situation */}
          <div className="opacity-0 animate-stagger-item" style={{ animationDelay: '240ms' }}>
            <SituationContext situation={morning.situation} />
          </div>

          {/* Reveal (J1 discovery only) */}
          {hasReveal(morning) && morning.reveal && (
            <div className="opacity-0 animate-stagger-item" style={{ animationDelay: '320ms' }}>
              <Card className="bg-accent-50">
                <p className="text-body text-accent-600 font-medium">
                  {morning.reveal}
                </p>
              </Card>
            </div>
          )}

          {/* Conjugation table */}
          <div className="opacity-0 animate-stagger-item" style={{ animationDelay: '400ms' }}>
            <ConjugationTable
              conjugation={tense.conjugation}
              tip={tense.conjugation_tip}
            />
          </div>

          {/* Francophone trap */}
          {tense.traps.length > 0 && (
            <div className="opacity-0 animate-stagger-item" style={{ animationDelay: '480ms' }}>
              <TrapAlert trap={tense.traps[0]} />
            </div>
          )}

          {/* Trap highlight */}
          {"trap_highlight" in morning &&
            morning.trap_highlight && (
              <div className="opacity-0 animate-stagger-item" style={{ animationDelay: '560ms' }}>
                <Card variant="trap">
                  <p className="text-body text-warm-500 font-medium">
                    {morning.trap_highlight}
                  </p>
                </Card>
              </div>
            )}

          {/* Memo tip */}
          {"memo_tip" in morning && morning.memo_tip && (
            <div className="opacity-0 animate-stagger-item" style={{ animationDelay: '640ms' }}>
              <MemoTip tip={morning.memo_tip} />
            </div>
          )}

          {/* More phrases */}
          {morning.more_phrases && morning.more_phrases.length > 0 && (
            <div className="opacity-0 animate-stagger-item" style={{ animationDelay: '720ms' }}>
              <MorePhrases phrases={morning.more_phrases} />
            </div>
          )}

          {/* Words to save */}
          {"words_to_save" in morning &&
            morning.words_to_save &&
            morning.words_to_save.length > 0 && (
              <div className="opacity-0 animate-stagger-item" style={{ animationDelay: '800ms' }}>
                <WordsToSave
                  words={morning.words_to_save}
                  verbId={verb.id}
                  dayKey={dayKey}
                />
              </div>
            )}

          {/* Complete button */}
          <div className="opacity-0 animate-stagger-item" style={{ animationDelay: '880ms' }}>
            <div className="pt-4">
              <Button
                variant="primary"
                size="lg"
                onClick={handleMorningComplete}
                className="w-full"
              >
                J&apos;ai compris, continuer
              </Button>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  // ── Evening lesson (challenges) ───────────────────────────
  if (isEvening && isEveningContent(dayContent)) {
    const evening = dayContent;

    return (
      <AppShell
        activeTab="lesson"
        title={`${verb.name_en.toUpperCase()} - Exercices`}
        showBack
      >
        <div className="px-4 py-6 space-y-5">
          {/* Day progress indicator */}
          <DayProgress completedDays={completedDays} currentDayKey={dayKey} />

          {/* Recap (J1 evening only) */}
          {"recap" in evening && evening.recap && (
            <Card className="bg-primary-50">
              <p className="text-body text-text-secondary">{evening.recap}</p>
            </Card>
          )}

          {/* Evening phrase (J1 evening only) */}
          {"phrase" in evening && evening.phrase && (
            <PhraseReveal phrase={evening.phrase} />
          )}

          {/* Challenge runner */}
          <ChallengeRunner
            challenge={evening.challenge}
            verbName={verb.name_en}
            onComplete={handleChallengeComplete}
          />
        </div>
      </AppShell>
    );
  }

  // Fallback
  return (
    <AppShell activeTab="lesson" title="Lecon">
      <div className="flex items-center justify-center h-64">
        <p className="text-body text-text-muted">Contenu en cours de chargement...</p>
      </div>
    </AppShell>
  );
}
