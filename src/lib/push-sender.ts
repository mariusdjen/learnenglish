import webpush from "web-push";
import { getAllSubscriptions, removeSubscription } from "./push-storage";
import type { PushSubscriptionData } from "./push-storage";

// Configure web-push with VAPID keys
const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;
const email = process.env.VAPID_EMAIL || "mailto:contact@example.com";

if (publicKey && privateKey) {
  webpush.setVapidDetails(email, publicKey, privateKey);
}

interface PushPayload {
  title: string;
  body: string;
  icon?: string;
}

export async function sendPushToSubscription(
  sub: PushSubscriptionData,
  payload: PushPayload,
): Promise<boolean> {
  try {
    await webpush.sendNotification(
      {
        endpoint: sub.endpoint,
        keys: sub.keys,
      },
      JSON.stringify(payload),
    );
    return true;
  } catch (err: unknown) {
    const statusCode = (err as { statusCode?: number }).statusCode;
    // 410 Gone or 404 = subscription expired, remove it
    if (statusCode === 410 || statusCode === 404) {
      removeSubscription(sub.endpoint);
    }
    return false;
  }
}

export async function sendPushToAll(payload: PushPayload): Promise<{
  sent: number;
  failed: number;
}> {
  const subs = getAllSubscriptions();
  let sent = 0;
  let failed = 0;

  for (const sub of subs) {
    const ok = await sendPushToSubscription(sub, payload);
    if (ok) sent++;
    else failed++;
  }

  return { sent, failed };
}

export async function sendMorningReminders(): Promise<void> {
  const subs = getAllSubscriptions().filter(
    (s) =>
      s.preferredTime === "morning" ||
      s.preferredTime === "lunch" ||
      s.preferredTime === "anytime",
  );

  const payload: PushPayload = {
    title: "English avec Marius",
    body: "Bonjour ! Ta lecon du matin t'attend. 3 minutes pour progresser !",
    icon: "/icons/icon-192.png",
  };

  for (const sub of subs) {
    await sendPushToSubscription(sub, payload);
  }
}

export async function sendEveningReminders(): Promise<void> {
  const subs = getAllSubscriptions().filter(
    (s) =>
      s.preferredTime === "evening" ||
      s.preferredTime === "lunch" ||
      s.preferredTime === "anytime",
  );

  const payload: PushPayload = {
    title: "English avec Marius",
    body: "Bonsoir ! C'est l'heure de tes exercices du soir.",
    icon: "/icons/icon-192.png",
  };

  for (const sub of subs) {
    await sendPushToSubscription(sub, payload);
  }
}
