import cron from "node-cron";
import { sendMorningReminders, sendEveningReminders } from "./push-sender";

let initialized = false;

export function initPushScheduler() {
  if (initialized) return;
  initialized = true;

  // Morning reminders at 8:00 AM every day
  cron.schedule("0 8 * * *", async () => {
    console.log("[push-scheduler] Sending morning reminders...");
    await sendMorningReminders();
    console.log("[push-scheduler] Morning reminders sent.");
  });

  // Evening reminders at 18:00 (6 PM) every day
  cron.schedule("0 18 * * *", async () => {
    console.log("[push-scheduler] Sending evening reminders...");
    await sendEveningReminders();
    console.log("[push-scheduler] Evening reminders sent.");
  });

  console.log("[push-scheduler] Cron jobs scheduled: 08:00 (morning), 18:00 (evening)");
}
