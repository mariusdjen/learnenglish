"use client";

import { useState, useEffect, useCallback } from "react";
import Button from "@/components/ui/Button";

interface FirstVictoryProps {
  onComplete: () => void;
}

type Phase = "intro" | "question" | "correct" | "wrong";

const CORRECT_ANSWER = "I am happy";
const ANSWER_OPTIONS = ["I am happy", "I have happy", "I do happy"];

// Confetti dot colors matching the project palette
const CONFETTI_COLORS = [
  "bg-primary-400",
  "bg-accent-400",
  "bg-warm-400",
  "bg-primary-300",
  "bg-accent-300",
  "bg-warm-300",
  "bg-primary-500",
  "bg-accent-500",
];

function ConfettiDots() {
  const [dots, setDots] = useState<
    { id: number; x: number; y: number; color: string; size: number; delay: number }[]
  >([]);

  useEffect(() => {
    const generated = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      size: Math.random() * 8 + 4,
      delay: Math.random() * 0.5,
    }));
    setDots(generated);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {dots.map((dot) => (
        <div
          key={dot.id}
          className={`absolute rounded-full ${dot.color} animate-confetti-dot`}
          style={{
            left: `${dot.x}%`,
            top: `${dot.y}%`,
            width: `${dot.size}px`,
            height: `${dot.size}px`,
            animationDelay: `${dot.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function FirstVictory({ onComplete }: FirstVictoryProps) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  // Auto-transition from intro to question
  useEffect(() => {
    if (phase === "intro") {
      const timer = setTimeout(() => setPhase("question"), 2000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const handleAnswer = useCallback((answer: string) => {
    setSelectedAnswer(answer);
    if (answer === CORRECT_ANSWER) {
      setPhase("correct");
    } else {
      setPhase("wrong");
      // Reset after a short pause so the user can try again
      setTimeout(() => {
        setSelectedAnswer(null);
        setPhase("question");
      }, 1200);
    }
  }, []);

  // -- Intro phase --
  if (phase === "intro") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-accent-100 flex items-center justify-center mx-auto animate-bounce-in">
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M16 4L20 12L28 13.5L22 19.5L23.5 28L16 24L8.5 28L10 19.5L4 13.5L12 12L16 4Z"
                fill="#22C55E"
                stroke="#16A34A"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="text-heading-lg font-bold text-primary-700">
            Ta premiere victoire !
          </h2>
          <p className="text-body text-text-secondary max-w-xs mx-auto">
            Voyons si tu peux traduire ta premiere phrase en anglais...
          </p>
        </div>
      </div>
    );
  }

  // -- Correct / celebration phase --
  if (phase === "correct") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 relative">
        <ConfettiDots />

        <div className="text-center space-y-6 z-20 animate-bounce-in">
          {/* Celebration circle */}
          <div className="w-24 h-24 rounded-full bg-accent-100 flex items-center justify-center mx-auto">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M12 25L20 33L36 15"
                stroke="#22C55E"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="space-y-3">
            <h2 className="text-heading-lg font-bold text-primary-700">
              Bravo !
            </h2>
            <p className="text-body text-text-secondary max-w-xs mx-auto">
              Tu viens d&apos;apprendre ta premiere phrase !
            </p>
          </div>

          {/* Show the phrase pair */}
          <div className="bg-surface-card rounded-[1rem] border border-accent-300 p-5 max-w-xs mx-auto shadow-sm">
            <p className="text-body font-bold text-accent-600 mb-1">
              I am happy
            </p>
            <p className="text-caption text-text-secondary">
              Je suis content(e)
            </p>
          </div>

          <div className="pt-4 w-full max-w-xs mx-auto">
            <Button
              variant="primary"
              size="lg"
              onClick={onComplete}
              className="w-full"
            >
              Commencer l&apos;aventure
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // -- Question phase (and wrong feedback) --
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-6 animate-slide-up">
      <div className="w-full max-w-sm space-y-8">
        {/* Prompt */}
        <div className="text-center space-y-3">
          <p className="text-caption font-semibold text-text-muted uppercase tracking-wide">
            Traduis en anglais
          </p>
          <div className="bg-surface-card rounded-[1rem] border border-primary-100 p-5 shadow-sm">
            <p className="text-heading font-bold text-text-primary">
              Je suis content(e)
            </p>
          </div>
        </div>

        {/* Answer options */}
        <div className="space-y-3">
          {ANSWER_OPTIONS.map((option) => {
            const isSelected = selectedAnswer === option;
            const isWrong = phase === "wrong" && isSelected;

            return (
              <button
                key={option}
                type="button"
                onClick={() => handleAnswer(option)}
                disabled={phase === "wrong"}
                className={`
                  w-full min-h-[56px] rounded-[1rem] p-4 text-left
                  border-2 transition-all duration-200
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  ${
                    isWrong
                      ? "bg-error-50 border-error-400 animate-shake"
                      : isSelected
                        ? "bg-primary-100 border-primary-500"
                        : "bg-surface-card border-primary-100 hover:border-primary-300 shadow-sm"
                  }
                `}
              >
                <p
                  className={`text-body font-semibold ${
                    isWrong
                      ? "text-error-500"
                      : isSelected
                        ? "text-primary-700"
                        : "text-text-primary"
                  }`}
                >
                  {option}
                </p>
              </button>
            );
          })}
        </div>

        {/* Wrong answer feedback */}
        {phase === "wrong" && (
          <div className="text-center animate-fade-in">
            <p className="text-body text-error-500 font-semibold">
              Pas tout a fait, essaie encore !
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
