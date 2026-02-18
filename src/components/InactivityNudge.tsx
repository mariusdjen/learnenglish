"use client";

import { useEffect, useRef } from "react";

const INACTIVITY_MS = 5 * 60 * 1000; // 5 minutes

export default function InactivityNudge() {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Only for users who haven't received the nudge yet
    if (localStorage.getItem("nudge-sent")) return;

    // Mark that we started tracking (first session)
    if (!localStorage.getItem("first-visit-at")) {
      localStorage.setItem("first-visit-at", Date.now().toString());
    }

    function resetTimer() {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(sendNudge, INACTIVITY_MS);
    }

    async function sendNudge() {
      if (localStorage.getItem("nudge-sent")) return;
      localStorage.setItem("nudge-sent", "true");

      try {
        const reg = await navigator.serviceWorker?.ready;
        if (reg) {
          await reg.showNotification("English avec Marius", {
            body: "Tu veux déjà abandonner ? Les autres comprennent l'anglais, toi tu es là... Maudiaaaa là",
            icon: "/icons/icon-192.png",
            badge: "/icons/icon-192.png",
            tag: "inactivity-nudge",
          });
        }
      } catch (err) {
        console.error("Nudge notification failed:", err);
      }
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
