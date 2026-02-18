"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserId, loadUserState } from "@/lib/sync";
import { useUserProgressStore } from "@/store/user-progress";
import { useNotebookStore } from "@/store/notebook-store";
import { useChatStore } from "@/store/chat-store";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const onboardingDone = localStorage.getItem("onboarding-complete") === "true";
    const userId = getUserId();

    if (onboardingDone && userId) {
      // Case 1: Known user — load state from server, hydrate stores, go home
      loadUserState(userId).then((state) => {
        if (state) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          useUserProgressStore.getState().hydrateFromServer(state.progress as any);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          useNotebookStore.getState().hydrateFromServer(state.notebook as any);
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          useChatStore.getState().hydrateFromServer(state.chat as any);
        }
        router.replace("/home");
      });
    } else if (onboardingDone && !userId) {
      // Case 2: Legacy user (onboarding done but no userId) — ask for name to migrate
      router.replace("/onboarding?migrate=true");
    } else {
      // Case 3: New user — full onboarding
      router.replace("/onboarding");
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center">
      <div className="animate-pulse text-primary-500 text-heading font-bold">
        English avec Marius
      </div>
    </div>
  );
}
