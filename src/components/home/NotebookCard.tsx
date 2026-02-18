"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";

interface NotebookCardProps {
  wordCount: number;
  correctionCount: number;
}

export default function NotebookCard({
  wordCount,
  correctionCount,
}: NotebookCardProps) {
  return (
    <Link href="/notebook" className="block animate-slide-up">
      <Card variant="interactive">
        <div className="flex items-center gap-4">
          {/* Book icon */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-card bg-accent-100">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M4 19.5V4.5C4 3.67 4.67 3 5.5 3H20V21H5.5C4.67 21 4 20.33 4 19.5Z"
                stroke="#16A34A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M4 19.5C4 18.67 4.67 18 5.5 18H20"
                stroke="#16A34A"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 7H16M8 11H13"
                stroke="#16A34A"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Text and badges */}
          <div className="flex-1">
            <h3 className="text-body font-bold text-text-primary">
              Mon carnet
            </h3>
            <div className="mt-1.5 flex items-center gap-2">
              <Badge variant="accent">
                {wordCount} {wordCount <= 1 ? "mot" : "mots"}
              </Badge>
              <Badge variant="warm">
                {correctionCount}{" "}
                {correctionCount <= 1 ? "correction" : "corrections"}
              </Badge>
            </div>
          </div>

          {/* Arrow */}
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className="shrink-0 text-text-muted"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </Card>
    </Link>
  );
}
