let syncTimer: ReturnType<typeof setTimeout> | null = null;
const DEBOUNCE_MS = 2000;

export function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("marius-user-id");
}

export function setUserId(id: string): void {
  localStorage.setItem("marius-user-id", id);
}

export function getUserName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("marius-user-name");
}

export function setUserName(name: string): void {
  localStorage.setItem("marius-user-name", name);
}

export async function identifyUser(name: string): Promise<{
  userId: string;
  name: string;
  isReturning: boolean;
  state: {
    progress: Record<string, unknown>;
    notebook: Record<string, unknown>;
    chat: Record<string, unknown>;
  } | null;
}> {
  const res = await fetch("/api/user/identify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Erreur serveur");
  }

  return res.json();
}

export function debouncedSync(
  getState: () => {
    progress: Record<string, unknown>;
    notebook: Record<string, unknown>;
    chat: Record<string, unknown>;
  },
): void {
  const userId = getUserId();
  if (!userId) return;

  if (syncTimer) clearTimeout(syncTimer);

  syncTimer = setTimeout(async () => {
    try {
      const state = getState();
      await fetch("/api/user/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, ...state }),
      });
    } catch (err) {
      console.error("Sync failed:", err);
    }
  }, DEBOUNCE_MS);
}

export async function loadUserState(
  userId: string,
): Promise<{
  progress: Record<string, unknown>;
  notebook: Record<string, unknown>;
  chat: Record<string, unknown>;
} | null> {
  try {
    const res = await fetch(`/api/user/sync?userId=${userId}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
