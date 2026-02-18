import type { VerbData, Tense, DayKey, DayMap } from "@/types/verb";
import type { UserProgress } from "@/types/progress";
import { getVerb, getNextVerbId, VERB_ORDER } from "@/lib/verbs";

// ── Constants ────────────────────────────────────────────────

const DAY_SEQUENCE: DayKey[] = [
  "J1_discovery",
  "J1_evening",
  "J2_challenge",
  "J2_evening",
  "J4_recall",
  "J4_evening",
  "J7_mastery",
  "J7_evening",
];

const MORNING_DAYS: DayKey[] = [
  "J1_discovery",
  "J2_challenge",
  "J4_recall",
  "J7_mastery",
];

const EVENING_DAYS: DayKey[] = [
  "J1_evening",
  "J2_evening",
  "J4_evening",
  "J7_evening",
];

// ── Time of day ──────────────────────────────────────────────

export type TimeOfDay = "morning" | "evening";

export function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  // Before 2 PM is "morning", after is "evening"
  return hour < 14 ? "morning" : "evening";
}

// ── Current lesson content ───────────────────────────────────

export interface CurrentLessonContent {
  verb: VerbData;
  tense: Tense;
  dayKey: DayKey;
  dayContent: DayMap[DayKey];
  isMorning: boolean;
  isEvening: boolean;
}

export function getCurrentLessonContent(
  progress: UserProgress,
): CurrentLessonContent | null {
  const { currentVerbId, currentTenseIndex, currentDayKey } = progress;

  const verb = getVerb(currentVerbId);
  if (!verb) return null;

  const tense = verb.tenses[currentTenseIndex];
  if (!tense) return null;

  const dayKey = currentDayKey as DayKey;
  const dayContent = tense.days[dayKey];
  if (!dayContent) return null;

  const isMorning = MORNING_DAYS.includes(dayKey);
  const isEvening = EVENING_DAYS.includes(dayKey);

  return {
    verb,
    tense,
    dayKey,
    dayContent,
    isMorning,
    isEvening,
  };
}

// ── Day sequence navigation ──────────────────────────────────

export function getNextDayKey(currentDayKey: DayKey): DayKey | null {
  const idx = DAY_SEQUENCE.indexOf(currentDayKey);
  if (idx === -1 || idx === DAY_SEQUENCE.length - 1) return null;
  return DAY_SEQUENCE[idx + 1];
}

// ── Day availability ─────────────────────────────────────────

export function isDayAvailableToday(
  dayKey: DayKey,
  daySchedule: Record<string, string>,
): boolean {
  const scheduledDate = daySchedule[dayKey];

  // If no schedule exists for the day, it's available
  if (!scheduledDate) return true;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const scheduled = new Date(scheduledDate);
  scheduled.setHours(0, 0, 0, 0);

  // Available if scheduled date is today or in the past
  return scheduled.getTime() <= today.getTime();
}

// ── Schedule computation ─────────────────────────────────────

export function computeScheduleForNextDay(
  completedDayKey: DayKey,
): Record<string, string> {
  const nextDayKey = getNextDayKey(completedDayKey);
  if (!nextDayKey) return {};

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let daysToAdd = 0;

  switch (completedDayKey) {
    case "J1_evening":
      // J1_evening -> J2_challenge: +1 day from today
      daysToAdd = 1;
      break;
    case "J2_evening":
      // J2_evening -> J4_recall: +2 days from today
      daysToAdd = 2;
      break;
    case "J4_evening":
      // J4_evening -> J7_mastery: +3 days from today
      daysToAdd = 3;
      break;
    default:
      // Morning -> Evening of same day: available immediately (same day)
      // Otherwise: available immediately
      daysToAdd = 0;
      break;
  }

  const scheduledDate = new Date(today);
  scheduledDate.setDate(scheduledDate.getDate() + daysToAdd);

  return {
    [nextDayKey]: scheduledDate.toISOString().split("T")[0],
  };
}

// ── Day progress ─────────────────────────────────────────────

export function getDayProgress(completedDays: string[]): {
  current: number;
  total: number;
  percentage: number;
} {
  const total = DAY_SEQUENCE.length;
  const current = completedDays.filter((day) =>
    DAY_SEQUENCE.includes(day as DayKey),
  ).length;
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0;

  return { current, total, percentage };
}
