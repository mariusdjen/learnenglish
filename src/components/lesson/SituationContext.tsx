"use client";

import Card from "@/components/ui/Card";

interface SituationContextProps {
  situation: string;
}

export default function SituationContext({ situation }: SituationContextProps) {
  return (
    <Card className="bg-surface-muted">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 flex-shrink-0">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M4 4h12a2 2 0 012 2v7a2 2 0 01-2 2H8l-4 3v-3a2 2 0 01-2-2V6a2 2 0 012-2z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-text-muted"
            />
          </svg>
        </div>
        <p className="text-body text-text-secondary italic leading-relaxed">
          {situation}
        </p>
      </div>
    </Card>
  );
}
