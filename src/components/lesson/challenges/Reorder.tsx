"use client";

import { useState, useMemo } from "react";
import Button from "@/components/ui/Button";
import AnswerFeedback from "./AnswerFeedback";
import { checkAnswer } from "@/lib/challenge-checker";

interface ReorderProps {
  words: string[];
  answer: string;
  hint: string;
  onResult: (correct: boolean) => void;
}

/**
 * Deterministic shuffle based on the words array content.
 * Produces a consistent order so the tiles do not re-shuffle on re-render,
 * but still differ from the correct answer order.
 */
function shuffleWords(words: string[]): string[] {
  const arr = [...words];
  // Simple seeded shuffle using the joined string as seed
  const seed = arr.join("").split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  // If the shuffle happens to produce the same order as the original, swap the first two
  if (arr.length > 1 && arr.join(" ") === words.join(" ")) {
    [arr[0], arr[1]] = [arr[1], arr[0]];
  }
  return arr;
}

export default function Reorder({
  words,
  answer,
  hint,
  onResult,
}: ReorderProps) {
  const shuffled = useMemo(() => shuffleWords(words), [words]);

  const [selected, setSelected] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{
    correct: boolean;
    normalizedUser: string;
    normalizedCorrect: string;
  } | null>(null);

  const handleSelectWord = (index: number) => {
    if (submitted) return;
    if (selected.includes(index)) return;
    setSelected([...selected, index]);
  };

  const handleRemoveWord = (positionInSentence: number) => {
    if (submitted) return;
    setSelected(selected.filter((_, i) => i !== positionInSentence));
  };

  const builtSentence = selected.map((i) => shuffled[i]).join(" ");
  const allWordsUsed = selected.length === shuffled.length;

  const handleSubmit = () => {
    if (!allWordsUsed || submitted) return;

    const checkResult = checkAnswer(builtSentence, answer);
    setResult(checkResult);
    setSubmitted(true);
    onResult(checkResult.correct);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Sentence zone - where selected words appear */}
      <div className="rounded-[1rem] bg-surface-card border-2 border-dashed border-primary-200 p-4 min-h-[3.5rem] flex flex-wrap gap-2 items-center">
        {selected.length === 0 && (
          <p className="text-caption text-text-muted">
            Appuie sur les mots pour construire la phrase...
          </p>
        )}
        {selected.map((wordIndex, posIndex) => (
          <button
            key={`selected-${posIndex}`}
            type="button"
            onClick={() => handleRemoveWord(posIndex)}
            disabled={submitted}
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-[0.5rem] text-body font-semibold transition-all ${
              submitted
                ? result?.correct
                  ? "bg-accent-100 text-accent-700 cursor-default"
                  : "bg-error-100 text-error-500 cursor-default"
                : "bg-primary-500 text-white hover:bg-primary-600 active:scale-95 cursor-pointer"
            }`}
          >
            {shuffled[wordIndex]}
            {!submitted && (
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                className="opacity-60"
              >
                <path
                  d="M3 3L9 9M9 3L3 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        ))}
      </div>

      {/* Available word tiles */}
      <div className="flex flex-wrap gap-2">
        {shuffled.map((word, index) => {
          const isSelected = selected.includes(index);
          return (
            <button
              key={`word-${index}`}
              type="button"
              onClick={() => handleSelectWord(index)}
              disabled={isSelected || submitted}
              className={`px-3 py-1.5 rounded-[0.5rem] text-body font-medium transition-all ${
                isSelected
                  ? "bg-surface-muted text-text-muted border border-transparent opacity-40 cursor-default"
                  : submitted
                    ? "bg-surface-muted text-text-muted border border-transparent cursor-default"
                    : "bg-surface-card text-text-primary border border-primary-200 hover:border-primary-400 hover:bg-primary-50 active:scale-95 cursor-pointer shadow-sm"
              }`}
            >
              {word}
            </button>
          );
        })}
      </div>

      {/* Hint toggle */}
      {!submitted && (
        <div>
          <button
            type="button"
            onClick={() => setShowHint(!showHint)}
            className="text-caption text-primary-500 font-semibold hover:text-primary-600 transition-colors"
          >
            {showHint ? "Masquer l'indice" : "Indice"}
          </button>
          {showHint && (
            <p className="mt-1 text-caption text-text-secondary italic animate-fade-in">
              {hint}
            </p>
          )}
        </div>
      )}

      {/* Submit button */}
      {!submitted && (
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!allWordsUsed}
          className="w-full"
        >
          Valider
        </Button>
      )}

      {/* Feedback */}
      {submitted && result && (
        <AnswerFeedback
          correct={result.correct}
          correctAnswer={answer}
          userAnswer={builtSentence}
        />
      )}
    </div>
  );
}
