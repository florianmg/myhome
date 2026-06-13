const CACHE_NAME = 'myhome-static-v1'

const CACHEABLE_PATHS = new Set([
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  '/manifest.json',
])

function isCacheableStaticAsset(request) {
  if (request.method !== 'GET') {
    return false
  }

  const url = new URL(request.url)

  if (url.origin !== self.location.origin) {
    return false
  }

  return (
    url.pathname.startsWith('/assets/') || CACHEABLE_PATHS.has(url.pathname)
  )
}

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName)),
        ),
      ),
  )
})

self.addEventListener('fetch', (event) => {
  if (!isCacheableStaticAsset(event.request)) {
    return
  }

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const responseToCache = response.clone()
          event.waitUntil(
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, responseToCache)),
          )
        }

        return response
      })
      .catch(() =>
        caches
          .match(event.request)
          .then((cachedResponse) => cachedResponse || Response.error()),
      ),
  )
})
