export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null;
  try {
    return await navigator.serviceWorker.register('/sw.js');
  } catch {
    return null;
  }
}

export function checkAndShowReminder(): void {
  const lastReminder = localStorage.getItem('notification-last-reminder');
  const preferredTime = localStorage.getItem('notification-preferred-time');
  const today = new Date().toISOString().split('T')[0];
  if (lastReminder === today) return;

  const hour = new Date().getHours();
  if (matchesPreferredTime(hour, preferredTime) && Notification.permission === 'granted') {
    new Notification('English avec Marius', {
      body: hour < 14
        ? 'Bonjour ! Ta lecon du matin t\'attend.'
        : 'Bonsoir ! C\'est l\'heure de tes exercices.',
      icon: '/icons/icon-192.png',
      tag: 'lesson-reminder',
    });
    localStorage.setItem('notification-last-reminder', today);
  }
}

function matchesPreferredTime(hour: number, preferredTime: string | null): boolean {
  switch (preferredTime) {
    case 'morning': return hour >= 7 && hour <= 10;
    case 'lunch': return hour >= 11 && hour <= 14;
    case 'evening': return hour >= 17 && hour <= 21;
    case 'anytime': return hour >= 7 && hour <= 21;
    default: return hour >= 8 && hour <= 20;
  }
}
