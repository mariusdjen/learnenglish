"use client";

import { useState, useEffect, useMemo } from "react";
import { useUserProgress } from "@/hooks/useUserProgress";
import { getCurrentLessonContent } from "@/lib/lesson-engine";

export function useCurrentLesson() {
  const progress = useUserProgress();
  const [isLoading, setIsLoading] = useState(true);

  // Hydration safety: mark as loaded once we are on the client
  useEffect(() => {
    setIsLoading(false);
  }, []);

  const lesson = useMemo(
    () => getCurrentLessonContent(progress),
    [progress.currentVerbId, progress.currentTenseIndex, progress.currentDayKey],
  );

  return {
    verb: lesson?.verb ?? null,
    tense: lesson?.tense ?? null,
    dayKey: lesson?.dayKey ?? null,
    dayContent: lesson?.dayContent ?? null,
    isMorning: lesson?.isMorning ?? false,
    isEvening: lesson?.isEvening ?? false,
    isLoading,
  };
}
