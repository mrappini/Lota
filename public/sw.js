self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (e) => {
  // PWA básico sem cache agressivo no momento, para manter as requisições em tempo real.
  e.respondWith(fetch(e.request));
});
