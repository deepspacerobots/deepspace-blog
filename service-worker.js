const files = [
  'assets/favicon/favicon.ico',
  'assets/font/refrigerator-semibold.woff2',
  'assets/font/refrigerator-bold.woff2',
  'assets/font/refrigerator-regular.woff2',
  'assets/js/components/asteroids.js',
  'assets/js/components/nipplejs.js',
  'assets/css/style.css',
  'the-void/index.html'
];

// Files to cache
const cacheName = 'deepspace1';

// Installing Service Worker
self.addEventListener('install', (e) => {
  console.log('[Service Worker] Install');
  e.waitUntil((async () => {
    const cache = await caches.open(cacheName);
    console.log('[Service Worker] Caching all: app shell and content');
    await cache.addAll(files);
  })());
});

// Fetching content using Service Worker
self.addEventListener('fetch', (e) => {

  if (!e.request.url.startsWith(self.location.origin)) {
    return;
  }
  // Ignore non-GET requests
  if (e.request.method !== 'GET') {
    return;
  }
  // Ignore browser-sync
  if (e.request.url.indexOf('browser-sync') > -1) {
    return;
  }

  files.forEach(file => {
    if (e.request.url.includes(file)) {
      e.respondWith(
        fetch(e.request).catch(error => {
          console.log('Asset', error);
          return caches.match(file);
        })
      );
    }
  });

  if (e.request.mode === 'navigate' ||
    (e.request.method === 'GET' &&
      e.request.headers.get('accept').includes('text/html'))) {
    console.log('Handling fetch event for', e.request.url);
    e.respondWith(
      fetch(e.request).catch(error => {
        console.log('Fetch failed; returning offline page instead.', error);
        return caches.match('/the-void/index.html');
      })
    );
  }
});