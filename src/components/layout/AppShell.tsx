"use client";

import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

type Tab = "lesson" | "chat" | "notebook" | "hall";

interface AppShellProps {
  children: React.ReactNode;
  activeTab: Tab;
  title?: string;
  showBack?: boolean;
  showNav?: boolean;
  rightAction?: React.ReactNode;
  /** When true, main fills remaining height without scrolling (chat layout) */
  fillHeight?: boolean;
}

export default function AppShell({
  children,
  activeTab,
  title = "English avec Marius",
  showBack = false,
  showNav = true,
  rightAction,
  fillHeight = false,
}: AppShellProps) {
  return (
    <div className="flex flex-col h-dvh bg-surface">
      <Header title={title} showBack={showBack} rightAction={rightAction} />

      <main
        className={`flex-1 min-h-0 ${
          fillHeight
            ? `overflow-hidden ${showNav ? "pb-16" : ""}`
            : `overflow-y-auto ${showNav ? "pb-20" : "pb-4"}`
        }`}
      >
        <div className={`max-w-lg mx-auto ${fillHeight ? "h-full flex flex-col" : ""}`}>
          {children}
        </div>
      </main>

      {showNav && <BottomNav activeTab={activeTab} />}
    </div>
  );
}
