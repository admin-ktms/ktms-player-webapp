const routes = new Map();


export function registerRoute(
  path,
  handler
) {

  routes.set(
    path,
    handler
  );

}


export function navigate(
  path
) {

  history.pushState(
    {},
    "",
    path
  );

  window.dispatchEvent(
    new PopStateEvent(
      "popstate"
    )
  );

}


export function getPath() {

  return (
    window.location.pathname
      .replace(
        /\/+$/,
        ""
      ) ||
    "/"
  );

}


export async function resolveRoute() {

  const path =
    getPath();

  const exact =
    routes.get(path);

  if (exact) {

    await exact();
    return;

  }


  if (
    path.startsWith(
      "/tournament/"
    )
  ) {

    const handler =
      routes.get(
        "/tournament/:id"
      );

    if (handler) {

      const id =
        decodeURIComponent(
          path.split("/")[2] || ""
        );

      await handler(id);
      return;

    }

  }


  if (
    path.startsWith(
      "/register/"
    )
  ) {

    const handler =
      routes.get(
        "/register/:id"
      );

    if (handler) {

      const id =
        decodeURIComponent(
          path.split("/")[2] || ""
        );

      await handler(id);
      return;

    }

  }


  const fallback =
    routes.get("*");

  if (fallback) {

    await fallback();

  }

}


window.addEventListener(
  "popstate",
  () => {

    resolveRoute();

  }
);
