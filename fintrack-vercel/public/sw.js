const CACHE_NAME = 'fintrack-shell-v1';
const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/fintrack-logo.png',
  '/icons/fintrack-192.png',
  '/icons/fintrack-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)),
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith('fintrack-') && cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      ),
    ),
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  if (event.request.method !== 'GET' || requestUrl.origin !== self.location.origin) return;

  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          return caches.open(CACHE_NAME).then((cache) => cache.put('/index.html', copy)).then(() => response);
        })
        .catch(async () => (await caches.match(event.request)) || caches.match('/index.html')),
    );
    return;
  }

  if (requestUrl.pathname.startsWith('/assets/') || requestUrl.pathname.startsWith('/icons/') || requestUrl.pathname === '/fintrack-logo.png') {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then((response) => {
          if (!response.ok) return response;
          const copy = response.clone();
          return caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy)).then(() => response);
        });
      }),
    );
  }
});
