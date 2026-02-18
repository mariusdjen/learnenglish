"use client";

import Card from "@/components/ui/Card";

interface MemoTipProps {
  tip: string;
}

export default function MemoTip({ tip }: MemoTipProps) {
  return (
    <Card variant="success">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M10 2a5 5 0 015 5c0 1.7-.83 3.2-2.1 4.13-.27.2-.4.5-.4.82V13a1 1 0 01-1 1H8.5a1 1 0 01-1-1v-.05c0-.32-.14-.63-.4-.82A5.002 5.002 0 0110 2z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-accent-500"
            />
            <path
              d="M8 15.5h4M8.5 17h3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              className="text-accent-500"
            />
          </svg>
        </div>
        <div>
          <h3 className="text-body font-bold text-accent-600 mb-1">
            Astuce memo
          </h3>
          <p className="text-body text-text-primary leading-relaxed">
            {tip}
          </p>
        </div>
      </div>
    </Card>
  );
}
