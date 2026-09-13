const CACHE_NAME =
  "ktms-player-v1";


const STATIC_ASSETS = [
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
  "/js/ui.js"
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
              STATIC_ASSETS
            )
        )

    );

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
                    caches.delete(key)
                )
            )
        )

    );

  }
);


self.addEventListener(
  "fetch",
  event => {

    if (
      event.request.method !==
      "GET"
    ) {

      return;

    }


    event.respondWith(

      fetch(
        event.request
      )
        .catch(
          () =>
            caches.match(
              event.request
            )
        )

    );

  }
);
