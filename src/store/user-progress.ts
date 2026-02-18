import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  UserProgress,
  UserLevel,
  PreferredTime,
  VerbStatus,
  TenseStatus,
  VerbProgressData,
  TenseProgressData,
  ChallengeResult,
} from "@/types/progress";
import { VERB_ORDER, getVerb, getNextVerbId } from "@/lib/verbs";

// The 8-step day sequence for each tense
const DAY_SEQUENCE = [
  "J1_discovery",
  "J1_evening",
  "J2_challenge",
  "J2_evening",
  "J4_recall",
  "J4_evening",
  "J7_mastery",
  "J7_evening",
] as const;

type DayKey = (typeof DAY_SEQUENCE)[number];

const INITIAL_STATE: UserProgress = {
  userId: "",
  userName: "",
  onboardingComplete: false,
  level: "beginner",
  preferredTime: "anytime",
  notificationsEnabled: false,

  currentVerbId: "be",
  currentTenseIndex: 0,
  currentDayKey: "J1_discovery",
  daySchedule: {},

  verbProgress: {},

  streakDays: 0,
  lastActiveDate: "",

  challengeHistory: [],
};

interface UserProgressActions {
  setIdentity: (userId: string, userName: string) => void;
  hydrateFromServer: (data: Partial<UserProgress>) => void;
  completeOnboarding: (level: UserLevel, preferredTime: PreferredTime) => void;
  completeDay: (
    verbId: string,
    tenseId: string,
    dayKey: string,
    score: number,
    total: number,
  ) => void;
  advanceToNextDay: () => void;
  updateStreak: () => void;
  setNotifications: (enabled: boolean) => void;
  reset: () => void;
}

type UserProgressStore = UserProgress & UserProgressActions;

export const useUserProgressStore = create<UserProgressStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      setIdentity: (userId: string, userName: string) => {
        set({ userId, userName });
      },

      hydrateFromServer: (data: Partial<UserProgress>) => {
        set({ ...data });
      },

      completeOnboarding: (level: UserLevel, preferredTime: PreferredTime) => {
        const verb = getVerb("be");
        const firstTenseId = verb?.tenses[0]?.id ?? "present";

        set({
          onboardingComplete: true,
          level,
          preferredTime,
          currentVerbId: "be",
          currentTenseIndex: 0,
          currentDayKey: "J1_discovery",
          verbProgress: {
            be: {
              status: "active" as VerbStatus,
              tenseProgress: {
                [firstTenseId]: {
                  status: "active" as TenseStatus,
                  completedDays: [],
                },
              },
            },
          },
        });
      },

      completeDay: (
        verbId: string,
        tenseId: string,
        dayKey: string,
        score: number,
        total: number,
      ) => {
        const state = get();
        const verbProgress = { ...state.verbProgress };

        // Ensure verb progress entry exists
        if (!verbProgress[verbId]) {
          verbProgress[verbId] = {
            status: "active",
            tenseProgress: {},
          };
        }

        const verbData = { ...verbProgress[verbId] };
        const tenseProgress = { ...verbData.tenseProgress };

        // Ensure tense progress entry exists
        if (!tenseProgress[tenseId]) {
          tenseProgress[tenseId] = {
            status: "active",
            completedDays: [],
          };
        }

        const tenseData = { ...tenseProgress[tenseId] };

        // Add day to completed days if not already there
        if (!tenseData.completedDays.includes(dayKey)) {
          tenseData.completedDays = [...tenseData.completedDays, dayKey];
        }

        tenseProgress[tenseId] = tenseData;
        verbData.tenseProgress = tenseProgress;
        verbProgress[verbId] = verbData;

        // Record challenge result
        const challengeResult: ChallengeResult = {
          date: new Date().toISOString(),
          verbId,
          tenseId,
          dayKey,
          score,
          total,
        };

        set({
          verbProgress,
          challengeHistory: [...state.challengeHistory, challengeResult],
        });
      },

      advanceToNextDay: () => {
        const state = get();
        const { currentVerbId, currentTenseIndex, currentDayKey } = state;

        const currentDayIndex = DAY_SEQUENCE.indexOf(currentDayKey as DayKey);

        // Try to advance to the next day within the current tense
        if (currentDayIndex < DAY_SEQUENCE.length - 1) {
          set({ currentDayKey: DAY_SEQUENCE[currentDayIndex + 1] });
          return;
        }

        // Current tense is done (all 8 days completed)
        // Mark current tense as mastered
        const verb = getVerb(currentVerbId);
        if (!verb) return;

        const currentTenseId = verb.tenses[currentTenseIndex]?.id;
        const verbProgress = { ...state.verbProgress };

        if (currentTenseId && verbProgress[currentVerbId]) {
          const verbData = { ...verbProgress[currentVerbId] };
          const tenseProgress = { ...verbData.tenseProgress };
          if (tenseProgress[currentTenseId]) {
            tenseProgress[currentTenseId] = {
              ...tenseProgress[currentTenseId],
              status: "mastered" as TenseStatus,
            };
          }
          verbData.tenseProgress = tenseProgress;
          verbProgress[currentVerbId] = verbData;
        }

        // Try to advance to the next tense within the current verb
        if (currentTenseIndex < verb.tenses.length - 1) {
          const nextTenseIndex = currentTenseIndex + 1;
          const nextTenseId = verb.tenses[nextTenseIndex]?.id;

          // Initialize next tense progress
          if (nextTenseId && verbProgress[currentVerbId]) {
            const verbData = { ...verbProgress[currentVerbId] };
            const tenseProgress = { ...verbData.tenseProgress };
            if (!tenseProgress[nextTenseId]) {
              tenseProgress[nextTenseId] = {
                status: "active" as TenseStatus,
                completedDays: [],
              };
            } else {
              tenseProgress[nextTenseId] = {
                ...tenseProgress[nextTenseId],
                status: "active" as TenseStatus,
              };
            }
            verbData.tenseProgress = tenseProgress;
            verbProgress[currentVerbId] = verbData;
          }

          set({
            currentTenseIndex: nextTenseIndex,
            currentDayKey: DAY_SEQUENCE[0],
            verbProgress,
          });
          return;
        }

        // All tenses for current verb are done - mark verb as mastered
        if (verbProgress[currentVerbId]) {
          verbProgress[currentVerbId] = {
            ...verbProgress[currentVerbId],
            status: "mastered" as VerbStatus,
          };
        }

        // Advance to the next verb
        const nextVerbId = getNextVerbId(currentVerbId);
        if (!nextVerbId) {
          // All verbs completed
          set({ verbProgress });
          return;
        }

        const nextVerb = getVerb(nextVerbId);
        const nextVerbFirstTenseId = nextVerb?.tenses[0]?.id;

        // Initialize next verb progress
        verbProgress[nextVerbId] = {
          status: "active" as VerbStatus,
          tenseProgress: nextVerbFirstTenseId
            ? {
                [nextVerbFirstTenseId]: {
                  status: "active" as TenseStatus,
                  completedDays: [],
                },
              }
            : {},
        };

        set({
          currentVerbId: nextVerbId,
          currentTenseIndex: 0,
          currentDayKey: DAY_SEQUENCE[0],
          verbProgress,
        });
      },

      updateStreak: () => {
        const state = get();
        const today = new Date().toISOString().split("T")[0];
        const lastActive = state.lastActiveDate;

        if (lastActive === today) {
          // Already updated today, do nothing
          return;
        }

        const yesterday = new Date(Date.now() - 86400000)
          .toISOString()
          .split("T")[0];

        if (lastActive === yesterday) {
          // Consecutive day - increment streak
          set({
            streakDays: state.streakDays + 1,
            lastActiveDate: today,
          });
        } else {
          // Streak broken or first day - reset to 1
          set({
            streakDays: 1,
            lastActiveDate: today,
          });
        }
      },

      setNotifications: (enabled: boolean) => {
        set({ notificationsEnabled: enabled });
      },

      reset: () => {
        set(INITIAL_STATE);
      },
    }),
    {
      name: "english-user-progress",
    },
  ),
);
