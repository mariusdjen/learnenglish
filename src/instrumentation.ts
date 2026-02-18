export async function register() {
  // Only run on the server (Node.js runtime)
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initPushScheduler } = await import("@/lib/push-scheduler");
    initPushScheduler();
  }
}
