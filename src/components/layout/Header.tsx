"use client";

import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
}

function BackArrowIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 12H5" />
      <path d="M12 19l-7-7 7-7" />
    </svg>
  );
}

export default function Header({ title, showBack = false, rightAction }: HeaderProps) {
  const router = useRouter();

  return (
    <header className="sticky top-0 z-40 bg-surface-card/80 glass border-b border-surface-muted/50 shadow-[var(--shadow-elevation-1)]">
      <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
        {/* Left slot: back button or spacer */}
        <div className="w-10 flex items-center justify-start">
          {showBack && (
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center justify-center w-10 h-10 -ml-2 rounded-full text-text-primary active:bg-surface-muted transition-colors"
              aria-label="Retour"
            >
              <BackArrowIcon />
            </button>
          )}
        </div>

        {/* Center: title */}
        <h1 className="text-body font-bold text-text-primary truncate text-center flex-1 mx-2">
          {title}
        </h1>

        {/* Right slot: action or spacer */}
        <div className="w-10 flex items-center justify-end">
          {rightAction ?? null}
        </div>
      </div>
    </header>
  );
}
