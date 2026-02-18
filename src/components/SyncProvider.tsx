"use client";

import { useEffect } from "react";
import { useUserProgressStore } from "@/store/user-progress";
import { useNotebookStore } from "@/store/notebook-store";
import { useChatStore } from "@/store/chat-store";
import { debouncedSync, getUserId } from "@/lib/sync";

function triggerSync() {
  if (!getUserId()) return;

  debouncedSync(() => {
    const {
      // Extract only serializable state (exclude actions)
      setIdentity: _1,
      hydrateFromServer: _2,
      completeOnboarding: _3,
      completeDay: _4,
      advanceToNextDay: _5,
      updateStreak: _6,
      setNotifications: _7,
      reset: _8,
      ...progress
    } = useUserProgressStore.getState();

    const { words, corrections } = useNotebookStore.getState();
    const { messages } = useChatStore.getState();

    return {
      progress,
      notebook: { words, corrections },
      chat: { messages },
    };
  });
}

export default function SyncProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const unsubProgress = useUserProgressStore.subscribe(() => triggerSync());
    const unsubNotebook = useNotebookStore.subscribe(() => triggerSync());
    const unsubChat = useChatStore.subscribe(() => triggerSync());

    return () => {
      unsubProgress();
      unsubNotebook();
      unsubChat();
    };
  }, []);

  return <>{children}</>;
}
