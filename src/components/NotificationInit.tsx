"use client";
import { useEffect } from "react";
import { registerServiceWorker, checkAndShowReminder } from "@/lib/notifications";
import { useUserProgressStore } from "@/store/user-progress";

export default function NotificationInit() {
  const notificationsEnabled = useUserProgressStore((s) => s.notificationsEnabled);

  // Always register service worker for PWA/offline support
  useEffect(() => {
    registerServiceWorker();
  }, []);

  // Notification reminders only when enabled
  useEffect(() => {
    if (notificationsEnabled) {
      checkAndShowReminder();
      const interval = setInterval(checkAndShowReminder, 30 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [notificationsEnabled]);

  return null;
}
