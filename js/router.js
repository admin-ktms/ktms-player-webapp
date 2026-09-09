import {
  setCurrentPath
} from "./state.js";


const routes = new Map();


let renderFunction = null;


/* ========================================================
 * PATH NORMALIZATION
 * ====================================================== */

function normalizePath(path) {

  if (!path) {
    return "/";
  }


  let normalized =
    String(path)
      .split("?")[0]
      .split("#")[0]
      .replace(/\/+/g, "/");


  if (
    normalized.length > 1 &&
    normalized.endsWith("/")
  ) {

    normalized =
      normalized.slice(0, -1);

  }


  if (!normalized.startsWith("/")) {

    normalized =
      "/" + normalized;

  }


  return normalized || "/";

}


/* ========================================================
 * ROUTE REGISTRATION
 * ====================================================== */

export function registerRoute(
  path,
  handler,
  options = {}
) {

  const normalized =
    normalizePath(path);


  routes.set(
    normalized,
    {
      handler,
      requiresAuth:
        options.requiresAuth === true,
      meta:
        options.meta || {}
    }
  );

}


/* ========================================================
 * CURRENT PATH
 * ====================================================== */

export function getCurrentPath() {

  return normalizePath(
    window.location.pathname
  );

}


/* ========================================================
 * ROUTE MATCHING
 * ====================================================== */

function findRoute(path) {

  const normalized =
    normalizePath(path);


  /*
   * Exact route first.
   */

  if (
    routes.has(normalized)
  ) {

    return {

      path: normalized,

      params: {},

      route:
        routes.get(normalized)

    };

  }


  /*
   * Parameterized route support.
   *
   * Example:
   *
   * /tournament/:tournamentId
   *
   * This does NOT invent or validate the
   * Tournament_ID. The authoritative ID is
   * resolved later through KTMS.
   */

  for (
    const [
      routePath,
      route
    ] of routes.entries()
  ) {

    const routeSegments =
      routePath
        .split("/")
        .filter(Boolean);


    const pathSegments =
      normalized
        .split("/")
        .filter(Boolean);


    if (
      routeSegments.length !==
      pathSegments.length
    ) {

      continue;

    }


    const params = {};

    let matches = true;


    for (
      let index = 0;
      index < routeSegments.length;
      index++
    ) {

      const routeSegment =
        routeSegments[index];

      const pathSegment =
        pathSegments[index];


      if (
        routeSegment.startsWith(":")
      ) {

        const parameterName =
          routeSegment.slice(1);


        params[parameterName] =
          decodeURIComponent(
            pathSegment
          );


        continue;

      }


      if (
        routeSegment !==
        pathSegment
      ) {

        matches = false;

        break;

      }

    }


    if (matches) {

      return {

        path: normalized,

        params,

        route

      };

    }

  }


  return null;

}


/* ========================================================
 * RENDERER
 * ====================================================== */

export function setRenderer(
  renderer
) {

  renderFunction =
    renderer;

}


/* ========================================================
 * NAVIGATION
 * ====================================================== */

export async function navigate(
  path,
  options = {}
) {

  const normalized =
    normalizePath(path);


  const currentPath =
    getCurrentPath();


  if (
    normalized === currentPath &&
    options.force !== true
  ) {

    await renderCurrentRoute();

    return;

  }


  if (
    options.replace === true
  ) {

    window.history.replaceState(
      {},
      "",
      normalized
    );

  } else {

    window.history.pushState(
      {},
      "",
      normalized
    );

  }


  await renderCurrentRoute();

}


/* ========================================================
 * RENDER CURRENT ROUTE
 * ====================================================== */

export async function renderCurrentRoute() {

  const path =
    getCurrentPath();


  setCurrentPath(path);


  if (!renderFunction) {
    return;
  }


  const match =
    findRoute(path);


  await renderFunction(
    path,
    match
  );

}


/* ========================================================
 * ROUTER STARTUP
 * ====================================================== */

export function startRouter() {

  document.addEventListener(
    "click",
    event => {

      const link =
        event.target.closest(
          "a[data-route]"
        );


      if (!link) {
        return;
      }


      /*
       * Respect modified clicks.
       *
       * Ctrl/Cmd-click,
       * middle-click, etc.
       * should retain normal browser behavior.
       */

      if (
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {

        return;

      }


      const href =
        link.getAttribute("href");


      if (!href) {
        return;
      }


      /*
       * Only intercept internal
       * application routes.
       */

      if (
        href.startsWith("#") ||
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
      ) {

        return;

      }


      event.preventDefault();


      navigate(href);

    }
  );


  window.addEventListener(
    "popstate",
    () => {

      renderCurrentRoute();

    }
  );

}