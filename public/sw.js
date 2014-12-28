var CACHE_KEY = 'webp-20141212';

self.addEventListener('install', function (e) {
  
  console.log('Service Worker:install', e);

  // e.waitUntil waits callback for "install"
  e.waitUntil(
    caches.open(CACHE_KEY).then(function (cache) {
      cache.keys().then(function (keys) {
        console.log(keys);
        return cache.addAll([
          '/css/app.min.css',
          '/css/app.css',
          '/js/app.min.js',
          '/js/app.js'
        ]);
      });
    })
  );
});

self.addEventListener('activate', function (e) {

  console.log('Service Worker:activate', e);

  e.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.filter(function (cacheName) {
          
        }).map(function (cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener('fetch', function (e) {

  console.log('Service Worker:fetch', e);

  e.respondWith(
    caches.open(CACHE_KEY).then(function (cache) {
      return cache.match(e.request).then(function (response) {
        return response || fetch(e.request.clone()).then(function (response) {
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});