/// <reference lib="webworker" />
// Custom service worker: Workbox precaches the app shell, and we add `push`
// + `notificationclick` handlers for web-push delivery.
//
// Built by vite-plugin-pwa's injectManifest strategy. `self.__WB_MANIFEST`
// is replaced at build time with the precache manifest.
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<{ url: string; revision: string | null }>;
};

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

self.skipWaiting();
clientsClaim();

type PushPayload = { title?: string; body?: string; url?: string };

self.addEventListener('push', (event: PushEvent) => {
  let payload: PushPayload = {};
  try {
    payload = (event.data?.json() as PushPayload) ?? {};
  } catch {
    // Older browsers / non-JSON payloads — fall back to text body.
    const text = event.data?.text();
    if (text) payload = { body: text };
  }

  const title = payload.title?.trim() || 'Bethesda Grace Hub';
  const body = payload.body?.trim() || '';
  const url = payload.url || '/';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon: '/icon-192.png',
      // No dedicated 72px badge ships with the app today; the 192 is reused
      // (Android downscales it). Replace with /icon-72.png when added.
      badge: '/icon-192.png',
      data: { url },
    }),
  );
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  const targetUrl =
    (event.notification.data && (event.notification.data as { url?: string }).url) || '/';

  event.waitUntil(
    (async () => {
      const allClients = await self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true,
      });
      for (const client of allClients) {
        try {
          const clientUrl = new URL(client.url);
          const targetParsed = new URL(targetUrl, self.location.origin);
          if (clientUrl.origin === targetParsed.origin) {
            await client.focus();
            if ('navigate' in client && clientUrl.pathname !== targetParsed.pathname) {
              await client.navigate(targetParsed.href);
            }
            return;
          }
        } catch {
          // Ignore malformed URLs and try the next client.
        }
      }
      await self.clients.openWindow(targetUrl);
    })(),
  );
});
