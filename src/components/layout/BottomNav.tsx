"use client";

import Link from "next/link";

type Tab = "lesson" | "chat" | "notebook" | "hall";

interface BottomNavProps {
  activeTab: Tab;
}

const tabs: { key: Tab; label: string; href: string }[] = [
  { key: "lesson", label: "Leçon", href: "/home" },
  { key: "chat", label: "Chat", href: "/chat" },
  { key: "notebook", label: "Carnet", href: "/notebook" },
  { key: "hall", label: "Hall", href: "/hall" },
];

function BookIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "var(--color-primary-500)" : "var(--color-text-muted)"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8" />
      <path d="M8 11h6" />
    </svg>
  );
}

function ChatIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "var(--color-primary-500)" : "var(--color-text-muted)"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <path d="M8 9h8" />
      <path d="M8 13h4" />
    </svg>
  );
}

function NotebookIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "var(--color-primary-500)" : "var(--color-text-muted)"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  );
}

function HallIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "var(--color-primary-500)" : "var(--color-text-muted)"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="3" y1="22" x2="21" y2="22" />
      <line x1="6" y1="18" x2="6" y2="11" />
      <line x1="10" y1="18" x2="10" y2="11" />
      <line x1="14" y1="18" x2="14" y2="11" />
      <line x1="18" y1="18" x2="18" y2="11" />
      <polygon points="12 2 20 7 4 7" />
      <line x1="2" y1="18" x2="22" y2="18" />
    </svg>
  );
}

const iconMap: Record<Tab, React.FC<{ active: boolean }>> = {
  lesson: BookIcon,
  chat: ChatIcon,
  notebook: NotebookIcon,
  hall: HallIcon,
};

export default function BottomNav({ activeTab }: BottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-surface-card/80 glass border-t border-surface-muted/50 shadow-[var(--shadow-elevation-3)]"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = iconMap[tab.key];

          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-0.5 w-full h-full transition-colors ${
                isActive ? "text-primary-500" : "text-text-muted"
              }`}
            >
              <Icon active={isActive} />
              <span
                className={`text-xs leading-tight font-semibold ${
                  isActive ? "text-primary-500" : "text-text-muted"
                }`}
              >
                {tab.label}
              </span>
              {isActive && (
                <span className="block h-0.5 w-5 rounded-full bg-primary-500 animate-indicator-slide" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
