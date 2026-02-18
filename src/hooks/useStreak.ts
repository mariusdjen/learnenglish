"use client";

import { useState, useEffect } from "react";
import { useUserProgressStore } from "@/store/user-progress";

export function useStreak() {
  const { streakDays, lastActiveDate } = useUserProgressStore();
  const [isActiveToday, setIsActiveToday] = useState(false);

  // Hydration safety: compare dates only on the client
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setIsActiveToday(lastActiveDate === today);
  }, [lastActiveDate]);

  return { streakDays, isActiveToday };
}
