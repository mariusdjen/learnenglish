// Types mirroring the JSON verb data structure

export interface VerbData {
  id: string;
  name_en: string;
  name_fr: string;
  order: number;
  personality: string;
  unlock_message: string;
  tenses: Tense[];
  summary: VerbSummary;
}

export interface Tense {
  id: string;
  name_simple: string;
  name_grammar: string;
  explanation_simple: string;
  conjugation: Record<string, string>;
  conjugation_tip: string;
  traps: Trap[];
  days: DayMap;
}

export interface Trap {
  id: string;
  wrong_fr: string;
  wrong_en: string;
  correct_en: string;
  explanation: string;
}

export type DayMap = {
  J1_discovery: DayDiscovery;
  J1_evening: DayEvening;
  J2_challenge: DayChallenge;
  J2_evening: DayChallengeEvening;
  J4_recall: DayRecall;
  J4_evening: DayRecallEvening;
  J7_mastery: DayMastery;
  J7_evening: DayMasteryEvening;
};

export type DayKey = keyof DayMap;

// Morning sessions
export interface DayDiscovery {
  title: string;
  time_of_day: "morning";
  phrase: Phrase;
  situation: string;
  reveal: string;
  more_phrases: Phrase[];
  trap_highlight: string;
  memo_tip: string;
  words_to_save: WordToSave[];
}

export interface DayChallenge {
  title: string;
  time_of_day: "morning";
  phrase: Phrase;
  situation: string;
  more_phrases: Phrase[];
  trap_highlight: string;
  memo_tip: string;
  words_to_save: WordToSave[];
}

export interface DayRecall {
  title: string;
  time_of_day: "morning";
  phrase: Phrase;
  situation: string;
  more_phrases: Phrase[];
  trap_highlight?: string;
  memo_tip: string;
  words_to_save: WordToSave[];
}

export interface DayMastery {
  title: string;
  time_of_day: "morning";
  phrase: Phrase;
  situation: string;
  more_phrases: Phrase[];
  trap_highlight?: string;
  words_to_save: WordToSave[];
}

// Evening sessions
export interface DayEvening {
  title: string;
  time_of_day: "evening";
  phrase: Phrase;
  recap: string;
  challenge: Challenge;
}

export interface DayChallengeEvening {
  title: string;
  time_of_day: "evening";
  challenge: Challenge;
}

export interface DayRecallEvening {
  title: string;
  time_of_day: "evening";
  challenge: Challenge;
}

export interface DayMasteryEvening {
  title: string;
  time_of_day: "evening";
  challenge: Challenge;
}

// Shared types
export interface Phrase {
  en: string;
  fr: string;
}

export interface WordToSave {
  en: string;
  fr: string;
}

export interface Challenge {
  type: "fill_blank" | "translate" | "reorder" | "mixed";
  instruction: string;
  questions: ChallengeQuestion[];
  mastery_message?: string;
}

export type ChallengeQuestion =
  | FillBlankQuestion
  | TranslateQuestion
  | ReorderQuestion
  | MixedQuestion;

export interface FillBlankQuestion {
  type?: "fill_blank";
  question: string;
  answer: string;
  hint: string;
}

export interface TranslateQuestion {
  type?: "translate";
  question: string;
  answer: string;
  also_accept?: string[];
  hint: string;
}

export interface ReorderQuestion {
  type?: "reorder";
  words: string[];
  answer: string;
  hint: string;
}

export interface MixedQuestion {
  type: "fill_blank" | "translate" | "reorder";
  question?: string;
  words?: string[];
  answer: string;
  also_accept?: string[];
  hint: string;
}

export interface VerbSummary {
  total_words: number;
  total_phrases: number;
  total_traps: number;
  total_challenges: number;
  total_days: number;
  estimated_mastery_time: string;
}
