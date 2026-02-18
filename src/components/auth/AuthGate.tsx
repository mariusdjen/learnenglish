"use client";

import { useState, useEffect } from "react";
import LockScreen from "./LockScreen";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState<boolean | null>(null);

  useEffect(() => {
    setUnlocked(localStorage.getItem("app-unlocked") === "true");
  }, []);

  // Loading state - avoid flash
  if (unlocked === null) {
    return (
      <div className="min-h-dvh bg-surface flex items-center justify-center">
        <div className="animate-pulse text-primary-500 text-heading font-bold">
          English avec Marius
        </div>
      </div>
    );
  }

  if (!unlocked) {
    return <LockScreen onUnlock={() => setUnlocked(true)} />;
  }

  return <>{children}</>;
}
