export type UserLevel = "beginner" | "some_basics" | "getting_by";
export type PreferredTime = "morning" | "lunch" | "evening" | "anytime";
export type VerbStatus = "locked" | "active" | "mastered";
export type TenseStatus = "locked" | "active" | "mastered";

export interface TenseProgressData {
  status: TenseStatus;
  completedDays: string[];
}

export interface VerbProgressData {
  status: VerbStatus;
  tenseProgress: Record<string, TenseProgressData>;
}

export interface ChallengeResult {
  date: string;
  verbId: string;
  tenseId: string;
  dayKey: string;
  score: number;
  total: number;
}

export interface UserProgress {
  userId: string;
  userName: string;
  onboardingComplete: boolean;
  level: UserLevel;
  preferredTime: PreferredTime;
  notificationsEnabled: boolean;

  currentVerbId: string;
  currentTenseIndex: number;
  currentDayKey: string;
  daySchedule: Record<string, string>; // dayKey -> ISO date

  verbProgress: Record<string, VerbProgressData>;

  streakDays: number;
  lastActiveDate: string;

  challengeHistory: ChallengeResult[];
}
