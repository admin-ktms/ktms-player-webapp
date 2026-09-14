const CACHE_NAME = "ktms-player-shell";

const APP_SHELL = [
  "/",
  "/index.html",
  "/manifest.webmanifest",
  "/css/app.css",
  "/css/components.css",
  "/css/responsive.css"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key === CACHE_NAME)
            .map(key => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  // Never intercept Supabase/API traffic.
  if (
    url.hostname.endsWith(".supabase.co") ||
    url.pathname.includes("/functions/")
  ) {
    return;
  }

  // Only handle requests belonging to this site.
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then(response => {
        return response;
      })
      .catch(() => {
        return caches.match(request)
          .then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }

            // If navigation fails completely, fall back to the app shell.
            if (request.mode === "navigate") {
              return caches.match("/index.html");
            }

            return Response.error();
          });
      })
  );
});
