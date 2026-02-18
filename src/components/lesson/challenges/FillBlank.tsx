"use client";

import { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";
import AnswerFeedback from "./AnswerFeedback";
import { checkAnswer } from "@/lib/challenge-checker";

interface FillBlankProps {
  question: string;
  answer: string;
  hint: string;
  onResult: (correct: boolean) => void;
}

export default function FillBlank({
  question,
  answer,
  hint,
  onResult,
}: FillBlankProps) {
  const [userInput, setUserInput] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{
    correct: boolean;
    normalizedUser: string;
    normalizedCorrect: string;
  } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = () => {
    if (!userInput.trim() || submitted) return;

    const checkResult = checkAnswer(userInput, answer);
    setResult(checkResult);
    setSubmitted(true);
    onResult(checkResult.correct);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  // Split the question around the blank marker "___"
  const parts = question.split(/___+/);
  const hasBlank = parts.length > 1;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Question with blank */}
      <div className="rounded-[1rem] bg-surface-card border border-primary-100 p-4 shadow-sm">
        {hasBlank ? (
          <p className="text-body-lg text-text-primary leading-relaxed">
            {parts[0]}
            {submitted ? (
              <span
                className={`inline-block font-bold px-2 py-0.5 rounded-[0.5rem] mx-1 ${
                  result?.correct
                    ? "bg-accent-100 text-accent-600"
                    : "bg-error-100 text-error-500"
                }`}
              >
                {userInput}
              </span>
            ) : (
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="..."
                className="inline-block w-32 border-b-2 border-primary-400 bg-primary-50 text-primary-700 font-semibold text-center mx-1 px-2 py-0.5 rounded-t-[0.25rem] focus:outline-none focus:border-primary-600 transition-colors"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                disabled={submitted}
              />
            )}
            {parts[1]}
          </p>
        ) : (
          <p className="text-body-lg text-text-primary leading-relaxed">
            {question}
          </p>
        )}
      </div>

      {/* Input field shown below when there is no inline blank */}
      {!hasBlank && !submitted && (
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Tape ta reponse..."
          className="w-full rounded-[0.75rem] border border-primary-200 bg-surface-card px-4 py-3 text-body text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent transition-all"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          disabled={submitted}
        />
      )}

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
          disabled={!userInput.trim()}
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
          userAnswer={userInput}
        />
      )}
    </div>
  );
}
