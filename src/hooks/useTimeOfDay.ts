"use client";

import { useState, useEffect } from "react";
import { getTimeOfDay, type TimeOfDay } from "@/lib/lesson-engine";

export function useTimeOfDay() {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("morning");
  const [isMorning, setIsMorning] = useState(true);
  const [isEvening, setIsEvening] = useState(false);

  // Hydration safety: only compute time of day on the client
  useEffect(() => {
    const tod = getTimeOfDay();
    setTimeOfDay(tod);
    setIsMorning(tod === "morning");
    setIsEvening(tod === "evening");
  }, []);

  return { timeOfDay, isMorning, isEvening };
}
