"use client";

import { useEffect, useRef } from "react";

const INACTIVITY_MS = 5 * 60 * 1000; // 5 minutes

const MAX_NUDGES_PER_DAY = 2;

const NUDGE_MESSAGES = [
  "Tu veux déjà abandonner ? Les autres comprennent l'anglais, toi tu es là... Maudiaaaa là",
  "5 minutes sans rien faire... L'anglais va pas s'apprendre tout seul hein",
  "Allo ? T'es encore là ? Ta lecon t'attend !",
  "Les autres progressent pendant que tu fais rien... Reviens !",
  "Marius te regarde... et il est decu la",
];

export default function InactivityNudge() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sentThisSession = useRef(false);

  useEffect(() => {
    function resetTimer() {
      if (timerRef.current) clearTimeout(timerRef.current);
      sentThisSession.current = false;
      timerRef.current = setTimeout(sendNudge, INACTIVITY_MS);
    }

    function getNudgeCountToday(): number {
      const raw = localStorage.getItem("nudge-today");
      if (!raw) return 0;
      try {
        const { date, count } = JSON.parse(raw);
        if (date === new Date().toISOString().split("T")[0]) return count;
      } catch { /* corrupted, reset */ }
      return 0;
    }

    function incrementNudgeCount() {
      const today = new Date().toISOString().split("T")[0];
      const count = getNudgeCountToday() + 1;
      localStorage.setItem("nudge-today", JSON.stringify({ date: today, count }));
    }

    async function sendNudge() {
      if (sentThisSession.current) return;
      if (getNudgeCountToday() >= MAX_NUDGES_PER_DAY) return;
      sentThisSession.current = true;
      incrementNudgeCount();

      const message =
        NUDGE_MESSAGES[Math.floor(Math.random() * NUDGE_MESSAGES.length)];

      try {
        const reg = await navigator.serviceWorker?.ready;
        if (reg) {
          await reg.showNotification("English avec Marius", {
            body: message,
            icon: "/icons/icon-192.png",
            badge: "/icons/icon-192.png",
            tag: "inactivity-nudge",
          });
        }
      } catch (err) {
        console.error("Nudge notification failed:", err);
      }

      // After sending, set up timer again for the next nudge
      timerRef.current = setTimeout(sendNudge, INACTIVITY_MS);
    }

    // Start the inactivity timer
    resetTimer();

    // Reset on any user interaction
    const events = ["click", "touchstart", "keydown", "scroll"];
    events.forEach((e) =>
      window.addEventListener(e, resetTimer, { passive: true }),
    );

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach((e) => window.removeEventListener(e, resetTimer));
    };
  }, []);

  return null;
}
