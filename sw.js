const CACHE_NAME = 'v1';
const assetsToCache = [
    '/blog-travel-pwa/',
    '/blog-travel-pwa/index.html',
    '/blog-travel-pwa/icon-192x192.png',
    '/blog-travel-pwa/icon-256x256.png',
    '/blog-travel-pwa/icon-384x384.png',
    '/blog-travel-pwa/icon-512x512.png',
    '/blog-travel-pwa/manifest.json'
];


self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(assetsToCache);
            })
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request).then(fetchResponse => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, fetchResponse.clone());
                        return fetchResponse;
                    });
                });
            })
    );
});
