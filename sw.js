// 考研政治 · 经纬图谱 Service Worker
const CACHE_NAME = 'jwtp-pwa-v1.0.0';

const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icons/icon.svg',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/favicon.png'
];

// Install: precache app shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching app shell assets');
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
});

// Activate: clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Strategy Network-First for HTML/navigation, Stale-While-Revalidate for static assets
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Handle HTML document / navigation
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(() => {
          console.log('[SW] Network failed, serving cached index.html');
          return caches.match('./index.html').then((cached) => {
            return cached || caches.match('./');
          });
        })
    );
    return;
  }

  // Handle static assets & icons: Cache-First with Network fallback
  event.respondWith(
    caches.match(req).then((cachedRes) => {
      if (cachedRes) {
        // Fetch in background to update cache (stale-while-revalidate)
        fetch(req).then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(req, networkRes));
          }
        }).catch(() => {/* ignore background fetch errors */});
        return cachedRes;
      }
      return fetch(req).then((networkRes) => {
        if (networkRes && networkRes.status === 200) {
          const resClone = networkRes.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
        }
        return networkRes;
      });
    })
  );
});
