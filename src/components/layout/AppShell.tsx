"use client";

import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";

type Tab = "lesson" | "chat" | "notebook";

interface AppShellProps {
  children: React.ReactNode;
  activeTab: Tab;
  title?: string;
  showBack?: boolean;
  showNav?: boolean;
  rightAction?: React.ReactNode;
}

export default function AppShell({
  children,
  activeTab,
  title = "English avec Marius",
  showBack = false,
  showNav = true,
  rightAction,
}: AppShellProps) {
  return (
    <div className="flex flex-col min-h-dvh bg-surface">
      <Header title={title} showBack={showBack} rightAction={rightAction} />

      <main
        className={`flex-1 overflow-y-auto ${
          showNav ? "pb-20" : "pb-4"
        }`}
      >
        <div className="max-w-lg mx-auto">
          {children}
        </div>
      </main>

      {showNav && <BottomNav activeTab={activeTab} />}
    </div>
  );
}
