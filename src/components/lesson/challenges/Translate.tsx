"use client";

import { useState, useRef, useEffect } from "react";
import Button from "@/components/ui/Button";
import AnswerFeedback from "./AnswerFeedback";
import { checkAnswer } from "@/lib/challenge-checker";

interface TranslateProps {
  question: string;
  answer: string;
  alsoAccept?: string[];
  hint: string;
  onResult: (correct: boolean) => void;
}

export default function Translate({
  question,
  answer,
  alsoAccept,
  hint,
  onResult,
}: TranslateProps) {
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

    const checkResult = checkAnswer(userInput, answer, alsoAccept);
    setResult(checkResult);
    setSubmitted(true);
    onResult(checkResult.correct);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* French sentence to translate */}
      <div className="rounded-[1rem] bg-primary-50 border border-primary-200 p-4">
        <p className="text-caption text-primary-500 font-semibold mb-1">
          Traduire en anglais :
        </p>
        <p className="text-body-lg text-primary-700 font-bold leading-relaxed">
          {question}
        </p>
      </div>

      {/* Input field */}
      {!submitted && (
        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your answer in English..."
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
