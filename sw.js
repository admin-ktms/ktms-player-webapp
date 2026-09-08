const CACHE_NAME =
  "ktms-shell-v1";


const SHELL_ASSETS = [
  "/",
  "/index.html",
  "/css/app.css",
  "/css/components.css",
  "/js/app.js",
  "/js/router.js",
  "/js/api.js",
  "/js/auth.js",
  "/js/state.js",
  "/js/ui.js",
  "/manifest.webmanifest"
];


self.addEventListener(
  "install",
  event => {

    event.waitUntil(

      caches
        .open(CACHE_NAME)
        .then(
          cache =>
            cache.addAll(
              SHELL_ASSETS
            )
        )

    );

    self.skipWaiting();

  }
);


self.addEventListener(
  "activate",
  event => {

    event.waitUntil(

      caches
        .keys()
        .then(
          keys =>
            Promise.all(
              keys
                .filter(
                  key =>
                    key !== CACHE_NAME
                )
                .map(
                  key =>
                    caches.delete(
                      key
                    )
                )
            )
        )

    );

    self.clients.claim();

  }
);


self.addEventListener(
  "fetch",
  event => {

    const request =
      event.request;


    /*
     * Do not intercept API POST requests.
     *
     * KTMS business data must remain
     * server-authoritative.
     */

    if (
      request.method !== "GET"
    ) {

      return;

    }


    const url =
      new URL(
        request.url
      );


    /*
     * Only cache requests belonging
     * to this Player Web App.
     */

    if (
      url.origin !==
      self.location.origin
    ) {

      return;

    }


    event.respondWith(

      fetch(request)
        .catch(
          () =>
            caches.match(request)
        )

    );

  }
);
