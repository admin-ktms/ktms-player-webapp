const CACHE_NAME = "ktms-player-v2";

const APP_SHELL = [
  "/",
  "/index.html",
  "/css/app.css",
  "/css/components.css",
  "/css/responsive.css",
  "/js/app.js",
  "/js/api.js",
  "/js/auth.js",
  "/js/config.js",
  "/js/router.js",
  "/js/state.js",
  "/js/ui.js",
  "/pages/home.js",
  "/pages/login.js",
  "/pages/verify.js",
  "/pages/tournament.js",
  "/pages/registration.js",
  "/components/tournament-card.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches
      .keys()
      .then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE_NAME)
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

  // Never cache API responses.
  if (
    url.pathname.includes("/functions/") ||
    url.hostname.includes("supabase.co")
  ) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then(response => {
        if (
          response &&
          response.status === 200 &&
          response.type === "basic"
        ) {
          const responseClone = response.clone();

          caches
            .open(CACHE_NAME)
            .then(cache => {
              cache.put(request, responseClone);
            });
        }

        return response;
      })
      .catch(() => caches.match(request))
  );
});
