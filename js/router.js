import {
  setCurrentPath
} from "./state.js";


const routes = new Map();


let renderFunction =
  null;


export function registerRoute(
  path,
  handler,
  options = {}
) {

  routes.set(
    path,
    {
      handler,
      requiresAuth:
        options.requiresAuth === true
    }
  );

}


export function getCurrentPath() {

  return normalizePath(
    window.location.pathname
  );

}


function normalizePath(
  path
) {

  if (!path) {
    return "/";
  }


  const normalized =
    path
      .replace(/\/+/g, "/")
      .replace(
        /\/$/,
        ""
      );


  return normalized || "/";

}


function findRoute(
  path
) {

  const normalized =
    normalizePath(path);


  if (
    routes.has(normalized)
  ) {

    return {
      path: normalized,
      route: routes.get(normalized)
    };

  }


  return null;

}


export function setRenderer(
  renderer
) {

  renderFunction =
    renderer;

}


export async function navigate(
  path,
  options = {}
) {

  const normalized =
    normalizePath(path);


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


      const href =
        link.getAttribute("href");


      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("http")
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
