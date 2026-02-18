"use client";

interface AnswerFeedbackProps {
  correct: boolean;
  correctAnswer: string;
  userAnswer: string;
}

export default function AnswerFeedback({
  correct,
  correctAnswer,
  userAnswer,
}: AnswerFeedbackProps) {
  if (correct) {
    return (
      <div className="animate-fade-in rounded-[1rem] bg-accent-50 border border-accent-300 p-4 flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M4 9.5L7.5 13L14 5"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-body font-bold text-accent-600">Correct !</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in rounded-[1rem] bg-error-50 border border-error-400 p-4 space-y-2">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-error-500 flex items-center justify-center">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M4 4L12 12M12 4L4 12"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <p className="text-body font-bold text-error-500">Incorrect</p>
      </div>
      <div className="pl-11 space-y-1">
        <p className="text-caption text-text-secondary">
          Ta reponse : <span className="line-through text-error-500">{userAnswer}</span>
        </p>
        <p className="text-caption text-text-secondary">
          La bonne reponse : <span className="font-semibold text-text-primary">{correctAnswer}</span>
        </p>
      </div>
    </div>
  );
}
