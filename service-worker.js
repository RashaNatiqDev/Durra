const CACHE_NAME = 'durra-ai-tutor-v9-20260911-step7';
const CORE = ['./','./index.html','./styles.css','./app.js','./messages.js','./ai-config.js','./tutor-v7.js','./manifest.json','./icons/icon-192.png','./icons/icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE)).catch(()=>null).then(()=>self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  const isFreshCode = event.request.mode === 'navigate' || ['script','style'].includes(event.request.destination);
  if (isFreshCode) {
    event.respondWith(fetch(event.request, {cache:'no-store'}).then(response => {
      if (response && response.status === 200) caches.open(CACHE_NAME).then(cache => cache.put(event.request,response.clone()));
      return response;
    }).catch(() => caches.match(event.request).then(cached => cached || caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    if (response && response.status === 200) caches.open(CACHE_NAME).then(cache => cache.put(event.request,response.clone()));
    return response;
  })));
});
