export interface SavedWord {
  id: string;
  en: string;
  fr: string;
  sourceVerbId: string;
  sourceDayKey: string;
  savedAt: string;
  reviewDates: string[];
  lastReviewedAt?: string;
  timesReviewed: number;
}

export interface Correction {
  id: string;
  original: string;
  corrected: string;
  explanation: string;
  date: string;
  verbRelated?: string;
}
