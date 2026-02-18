import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  preferredTime: string; // "morning" | "lunch" | "evening" | "anytime"
  subscribedAt: string;
}

const STORAGE_PATH = join(process.cwd(), "data", "push-subscriptions.json");

function ensureDir() {
  const dir = join(process.cwd(), "data");
  if (!existsSync(dir)) {
    const { mkdirSync } = require("fs");
    mkdirSync(dir, { recursive: true });
  }
}

export function getAllSubscriptions(): PushSubscriptionData[] {
  try {
    if (!existsSync(STORAGE_PATH)) return [];
    const raw = readFileSync(STORAGE_PATH, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveSubscription(sub: PushSubscriptionData): void {
  ensureDir();
  const subs = getAllSubscriptions();
  // Replace if same endpoint exists
  const idx = subs.findIndex((s) => s.endpoint === sub.endpoint);
  if (idx >= 0) {
    subs[idx] = sub;
  } else {
    subs.push(sub);
  }
  writeFileSync(STORAGE_PATH, JSON.stringify(subs, null, 2));
}

export function removeSubscription(endpoint: string): void {
  ensureDir();
  const subs = getAllSubscriptions().filter((s) => s.endpoint !== endpoint);
  writeFileSync(STORAGE_PATH, JSON.stringify(subs, null, 2));
}

export function getSubscriptionsByTime(timeSlot: string): PushSubscriptionData[] {
  return getAllSubscriptions().filter(
    (s) => s.preferredTime === timeSlot || s.preferredTime === "anytime"
  );
}
