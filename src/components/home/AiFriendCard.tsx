"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";

export default function AiFriendCard() {
  return (
    <Link href="/chat" className="block animate-slide-up">
      <Card variant="interactive">
        <div className="flex items-center gap-4">
          {/* Chat bubble icon */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-card bg-primary-100">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M21 11.5C21 16.19 16.97 20 12 20C10.82 20 9.69 19.79 8.65 19.41L3 21L4.89 16.68C3.7 15.18 3 13.4 3 11.5C3 6.81 7.03 3 12 3C16.97 3 21 6.81 21 11.5Z"
                stroke="#3B82F6"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 11.5H8.01M12 11.5H12.01M16 11.5H16.01"
                stroke="#3B82F6"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          {/* Text content */}
          <div className="flex-1">
            <h3 className="text-body font-bold text-text-primary">
              Discute avec Marius
            </h3>
            <p className="text-caption text-text-secondary mt-0.5">
              Pratique l&apos;anglais en conversant
            </p>
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
