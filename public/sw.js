// Levli Service Worker — Push notifications with deep-link navigation.
// Handles push events (show notifications with URL data) and notificationclick
// events (focus or open the correct app screen based on the deep-link URL).

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = JSON.parse(event.data.text());
  } catch (e) {
    data = { title: 'Levli', body: event.data ? event.data.text() : '' };
  }

  const title = data.title || 'Levli';
  const options = {
    body: data.body || '',
    icon: '/levli-logo-icon.svg',
    badge: '/levli-logo-icon.svg',
    data: { url: data.url || '/' },
    vibrate: [100],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const url = (event.notification.data && event.notification.data.url) || '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // Focus an existing window and navigate to the deep-link URL
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          if (client.navigate) {
            client.navigate(url);
          }
          return client.focus();
        }
      }
      // No existing window — open a new one
      if (self.clients.openWindow) {
        return self.clients.openWindow(url);
      }
    })
  );
});
