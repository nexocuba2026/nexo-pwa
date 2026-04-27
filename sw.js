const CACHE_NAME = 'hostal-emanuel-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/imagenes/icono-192.png',
  '/imagenes/icono-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});