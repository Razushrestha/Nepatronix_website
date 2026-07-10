// Self-uninstalling service worker.
// Any browser that previously registered a worker on this origin will fetch
// this file, take over, unregister itself, clear caches, and then let the
// network handle every request. Once no clients hold a stale registration,
// the 404s stop. Harmless to keep permanently.

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      try {
        await self.registration.unregister();
      } catch {}
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map((key) => caches.delete(key)));
      const clients = await self.clients.matchAll({ includeUncontrolled: true });
      for (const client of clients) {
        if (client.url) {
          client.postMessage({ type: "SW_UNREGISTERED" });
        }
      }
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  // Pass through to the network; never intercept.
  return;
});
