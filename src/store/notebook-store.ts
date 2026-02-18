import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SavedWord, Correction } from "@/types/notebook";

interface NotebookState {
  words: SavedWord[];
  corrections: Correction[];
}

interface NotebookActions {
  hydrateFromServer: (data: { words?: SavedWord[]; corrections?: Correction[] }) => void;
  saveWord: (word: {
    en: string;
    fr: string;
    sourceVerbId: string;
    sourceDayKey: string;
  }) => void;
  removeWord: (id: string) => void;
  isWordSaved: (en: string) => boolean;
  markReviewed: (id: string) => void;
  addCorrection: (correction: Omit<Correction, "id" | "date">) => void;
  getWordsForReview: () => SavedWord[];
}

type NotebookStore = NotebookState & NotebookActions;

const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

export const useNotebookStore = create<NotebookStore>()(
  persist(
    (set, get) => ({
      words: [],
      corrections: [],

      hydrateFromServer: (data) => {
        set({
          words: data.words ?? [],
          corrections: data.corrections ?? [],
        });
      },

      saveWord: (word) => {
        const newWord: SavedWord = {
          id: crypto.randomUUID(),
          en: word.en,
          fr: word.fr,
          sourceVerbId: word.sourceVerbId,
          sourceDayKey: word.sourceDayKey,
          savedAt: new Date().toISOString(),
          reviewDates: [],
          lastReviewedAt: undefined,
          timesReviewed: 0,
        };

        set((state) => ({
          words: [...state.words, newWord],
        }));
      },

      removeWord: (id: string) => {
        set((state) => ({
          words: state.words.filter((w) => w.id !== id),
        }));
      },

      isWordSaved: (en: string) => {
        return get().words.some((w) => w.en === en);
      },

      markReviewed: (id: string) => {
        const now = new Date().toISOString();

        set((state) => ({
          words: state.words.map((w) =>
            w.id === id
              ? {
                  ...w,
                  lastReviewedAt: now,
                  timesReviewed: w.timesReviewed + 1,
                  reviewDates: [...w.reviewDates, now],
                }
              : w,
          ),
        }));
      },

      addCorrection: (correction: Omit<Correction, "id" | "date">) => {
        const newCorrection: Correction = {
          ...correction,
          id: crypto.randomUUID(),
          date: new Date().toISOString(),
        };

        set((state) => ({
          corrections: [...state.corrections, newCorrection],
        }));
      },

      getWordsForReview: () => {
        const now = Date.now();
        return get().words.filter((w) => {
          if (!w.lastReviewedAt) return true;
          const lastReview = new Date(w.lastReviewedAt).getTime();
          return now - lastReview > TWO_DAYS_MS;
        });
      },
    }),
    {
      name: "english-notebook",
    },
  ),
);
