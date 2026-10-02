/* SACHIB Energy offline cache — free, no server. v0.1-pilot */
const CACHE = 'sachib-pilot-v1';
const FILES = ['index.html', 'design.html', 'assets/logo.svg', 'assets/favicon.svg'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()).catch(() => {}));
});
self.addEventListener('activate', (e) => { e.waitUntil(self.clients.claim()); });
self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((hit) => hit || fetch(e.request).catch(() => caches.match('index.html'))));
});
