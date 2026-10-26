// ============================================================================
// Pages by Nana - Service Worker for PWA & Offline Chapter Reading
// ============================================================================

const CACHE_NAME = 'pages-by-nana-v1';

// Core assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/books',
  '/manifest.webmanifest',
  '/favicon.ico',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-GET requests or admin/api routes
  if (
    event.request.method !== 'GET' ||
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/api')
  ) {
    return;
  }

  // Network-first with cache fallback for chapter & book pages
  if (url.pathname.startsWith('/books')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If completely uncached and offline
            return new Response(
              `<!DOCTYPE html>
              <html lang="en" data-theme="light">
              <head><title>Offline Chapter — Pages by Nana</title></head>
              <body style="font-family:serif;background:#FBF8F3;color:#2A2420;padding:40px;text-align:center;">
                <h2>You are currently offline</h2>
                <p>This chapter was not previously opened on this device. Once you reconnect, opened chapters remain readable offline.</p>
                <p><a href="/books" style="color:#8C2F39;">Return to Library</a></p>
              </body>
              </html>`,
              { headers: { 'Content-Type': 'text/html' } }
            );
          });
        })
    );
    return;
  }

  // Cache-first strategy for static assets (scripts, styles, fonts, images)
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(event.request).then((response) => {
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      });
    })
  );
});
