self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {
    title: 'English avec Marius',
    body: "C'est l'heure de ta lecon !",
    icon: '/icons/icon-192.png',
  };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: 'lesson-reminder',
      renotify: true,
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      if (clientList.length > 0) return clientList[0].focus();
      return clients.openWindow('/home');
    })
  );
});
