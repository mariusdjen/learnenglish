"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import type {
  Challenge,
  ChallengeQuestion,
  FillBlankQuestion,
  TranslateQuestion,
  ReorderQuestion,
  MixedQuestion,
} from "@/types/verb";
import FillBlank from "./FillBlank";
import Translate from "./Translate";
import Reorder from "./Reorder";
import MasteryMessage from "./MasteryMessage";
import Button from "@/components/ui/Button";

interface ChallengeRunnerProps {
  challenge: Challenge;
  verbName?: string;
  onComplete: (score: number, total: number) => void;
}

type Phase = "answering" | "feedback" | "mastery" | "summary";

/**
 * Resolve the effective question type.
 * - For "mixed" challenges, each question carries its own `type` field.
 * - For uniform challenges ("fill_blank", "translate", "reorder"), the
 *   challenge-level type is the type for every question.
 */
function resolveQuestionType(
  challengeType: Challenge["type"],
  question: ChallengeQuestion,
): "fill_blank" | "translate" | "reorder" {
  if (challengeType === "mixed") {
    return (question as MixedQuestion).type;
  }
  return challengeType;
}

export default function ChallengeRunner({
  challenge,
  verbName = "",
  onComplete,
}: ChallengeRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState<Phase>("answering");
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const total = challenge.questions.length;
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  const handleResult = useCallback(
    (correct: boolean) => {
      if (correct) {
        setScore((prev) => prev + 1);
      }

      setPhase("feedback");

      feedbackTimerRef.current = setTimeout(() => {
        const nextIndex = currentIndex + 1;

        if (nextIndex >= total) {
          // All questions answered
          if (challenge.mastery_message) {
            setPhase("mastery");
          } else {
            setPhase("summary");
          }
        } else {
          setCurrentIndex(nextIndex);
          setPhase("answering");
        }
      }, 2000);
    },
    [currentIndex, total, challenge.mastery_message],
  );

  const handleMasteryContinue = useCallback(() => {
    setPhase("summary");
  }, []);

  const handleFinish = useCallback(() => {
    const finalScore = score;
    onCompleteRef.current(finalScore, total);
  }, [score, total]);

  // -- Mastery screen --
  if (phase === "mastery") {
    return (
      <MasteryMessage
        message={challenge.mastery_message!}
        verbName={verbName}
        onContinue={handleMasteryContinue}
      />
    );
  }

  // -- Summary screen --
  if (phase === "summary") {
    const percent = total > 0 ? Math.round((score / total) * 100) : 0;
    const allCorrect = score === total;

    return (
      <div className="flex flex-col items-center justify-center text-center px-6 py-10 animate-fade-in space-y-4">
        <div className="animate-bounce-in">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center ${
              allCorrect ? "bg-accent-100" : "bg-primary-100"
            }`}
          >
            <span className="text-heading-lg font-bold text-primary-700">
              {percent}%
            </span>
          </div>
        </div>
        <h2 className="text-heading font-bold text-text-primary">
          {allCorrect
            ? "Parfait !"
            : percent >= 50
              ? "Bien joue !"
              : "Continue tes efforts !"}
        </h2>
        <p className="text-body text-text-secondary">
          {score} / {total} bonnes reponses
        </p>
        <div className="mt-4 w-full max-w-xs">
          <Button
            variant="primary"
            size="lg"
            onClick={handleFinish}
            className="w-full"
          >
            Continuer
          </Button>
        </div>
      </div>
    );
  }

  // -- Question screen --
  const question = challenge.questions[currentIndex];
  const questionType = resolveQuestionType(challenge.type, question);

  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-caption text-text-muted font-semibold">
            Question {currentIndex + 1} / {total}
          </p>
          <p className="text-caption text-text-muted font-semibold">
            {score} correct{score !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="w-full h-2 bg-surface-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${((currentIndex) / total) * 100}%` }}
          />
        </div>
      </div>

      {/* Instruction */}
      <p className="text-body font-semibold text-text-primary">
        {challenge.instruction}
      </p>

      {/* Render the appropriate question component */}
      {questionType === "fill_blank" && (
        <FillBlank
          key={currentIndex}
          question={(question as FillBlankQuestion | MixedQuestion).question!}
          answer={question.answer}
          hint={question.hint}
          onResult={handleResult}
        />
      )}

      {questionType === "translate" && (
        <Translate
          key={currentIndex}
          question={(question as TranslateQuestion | MixedQuestion).question!}
          answer={question.answer}
          alsoAccept={(question as TranslateQuestion | MixedQuestion).also_accept}
          hint={question.hint}
          onResult={handleResult}
        />
      )}

      {questionType === "reorder" && (
        <Reorder
          key={currentIndex}
          words={(question as ReorderQuestion | MixedQuestion).words!}
          answer={question.answer}
          hint={question.hint}
          onResult={handleResult}
        />
      )}
    </div>
  );
}
