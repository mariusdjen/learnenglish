"use client";
import { useEffect } from "react";
import { registerServiceWorker } from "@/lib/notifications";

export default function NotificationInit() {
  // Always register service worker for PWA/offline + push support
  useEffect(() => {
    registerServiceWorker();
  }, []);

  return null;
}
