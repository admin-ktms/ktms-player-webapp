import {
  startRouter,
  registerRoute,
  setRenderer,
  renderCurrentRoute
} from "./router.js";

import {
  validateSession,
  isAuthenticated,
  logout
} from "./auth.js";

import {
  renderLoading,
  renderError,
  showToast
} from "./ui.js";


const mainContent =
  document.getElementById(
    "main-content"
  );


function pageTemplate(
  title,
  description = ""
) {

  return `

    <section class="page">

      <header class="page-header">

        <h1 class="page-title">
          ${title}
        </h1>

        ${
          description
            ? `
              <p class="page-description">
                ${description}
              </p>
            `
            : ""
        }

      </header>

    </section>

  `;

}


function renderHome() {

  mainContent.innerHTML = `

    <section class="page">

      <header class="page-header">

        <span class="status-pill status-pill-primary">
          KTMS PLAYER
        </span>

        <h1 class="page-title">
          Find your tournament.
        </h1>

        <p class="page-description">
          Discover active KickOff tournaments,
          enter competitions and manage your
          participation from one player account.
        </p>

      </header>


      <div class="card">

        <h2 class="card-title">
          Tournament discovery
        </h2>

        <p class="card-text">
          Tournament listings will be connected
          to the KTMS API in the next implementation
          phase.
        </p>

        <br>

        <a
          href="/tournaments"
          class="button button-primary"
          data-route
        >
          Browse Tournaments
        </a>

      </div>

    </section>

  `;

}


function renderTournaments() {

  mainContent.innerHTML = `

    <section class="page">

      <header class="page-header">

        <span class="status-pill status-pill-primary">
          TOURNAMENTS
        </span>

        <h1 class="page-title">
          Active Tournaments
        </h1>

        <p class="page-description">
          Available tournament discovery will
          be connected to the public KTMS API
          during the read-only portal phase.
        </p>

      </header>


      <div
        id="tournament-list"
        class="card"
      >

        ${renderLoading(
          "Loading tournaments..."
        )}

      </div>

    </section>

  `;

}


function renderLogin() {

  mainContent.innerHTML =
    pageTemplate(
      "Player Login",
      "Sign in using your KTMS player account."
    ) +
    `

      <div class="card">

        <p class="card-text">
          Authentication UI will be connected
          to the centralized KTMS authentication
          client during the authentication screen
          implementation.
        </p>

      </div>

    `;

}


function renderDashboard() {

  mainContent.innerHTML =
    pageTemplate(
      "Dashboard",
      "Your current KTMS player activity."
    ) +
    `

      <div class="card">

        <h2 class="card-title">
          Player Dashboard
        </h2>

        <p class="card-text">
          Dashboard data will be populated from
          authenticated KTMS projections.
        </p>

      </div>

    `;

}


function renderProtectedPlaceholder(
  title,
  description
) {

  mainContent.innerHTML =
    pageTemplate(
      title,
      description
    ) +
    `

      <div class="card">

        <p class="card-text">
          This authenticated area is reserved
          for the corresponding KTMS portal phase.
        </p>

      </div>

    `;

}


function renderNotFound() {

  mainContent.innerHTML = `

    <section class="page">

      <span class="status-pill">
        404
      </span>

      <h1 class="page-title">
        Page not found
      </h1>

      <p class="page-description">
        The requested KTMS application route
        does not exist.
      </p>

      <br>

      <a
        href="/"
        class="button button-primary"
        data-route
      >
        Return Home
      </a>

    </section>

  `;

}


async function renderRoute(
  path,
  match
) {

  if (!match) {

    renderNotFound();

    return;

  }


  if (
    match.route.requiresAuth &&
    !isAuthenticated()
  ) {

    window.history.replaceState(
      {},
      "",
      "/login"
    );


    await renderCurrentRoute();

    return;

  }


  try {

    await match.route.handler();

  } catch (error) {

    console.error(
      "KTMS route error:",
      error
    );


    mainContent.innerHTML =
      renderError(
        "We could not load this page. Please try again."
      );

  }

}


function setupNavigationMenu() {

  const toggle =
    document.getElementById(
      "menu-toggle"
    );

  const close =
    document.getElementById(
      "menu-close"
    );

  const menu =
    document.getElementById(
      "secondary-menu"
    );


  if (
    !toggle ||
    !close ||
    !menu
  ) {
    return;
  }


  function setMenuOpen(
    open
  ) {

    menu.classList.toggle(
      "open",
      open
    );

    menu.setAttribute(
      "aria-hidden",
      String(!open)
    );

    toggle.setAttribute(
      "aria-expanded",
      String(open)
    );

  }


  toggle.addEventListener(
    "click",
    () => {

      setMenuOpen(
        !menu.classList.contains(
          "open"
        )
      );

    }
  );


  close.addEventListener(
    "click",
    () => {

      setMenuOpen(false);

    }
  );


  menu.addEventListener(
    "click",
    event => {

      if (
        event.target.closest(
          "[data-route]"
        )
      ) {

        setMenuOpen(false);

      }

    }
  );

}


function setupLogout() {

  const button =
    document.getElementById(
      "menu-logout"
    );


  if (!button) {
    return;
  }


  button.addEventListener(
    "click",
    async () => {

      try {

        await logout();

        showToast(
          "You have been logged out."
        );


        window.history.pushState(
          {},
          "",
          "/"
        );


        await renderCurrentRoute();

      } catch (error) {

        console.error(
          "KTMS logout error:",
          error
        );

      }

    }
  );

}


function registerApplicationRoutes() {

  registerRoute(
    "/",
    renderHome
  );


  registerRoute(
    "/tournaments",
    renderTournaments
  );


  registerRoute(
    "/login",
    renderLogin
  );


  registerRoute(
    "/dashboard",
    renderDashboard,
    {
      requiresAuth: true
    }
  );


  registerRoute(
    "/dashboard/fixtures",
    () =>
      renderProtectedPlaceholder(
        "Fixtures",
        "Your upcoming and completed fixtures."
      ),
    {
      requiresAuth: true
    }
  );


  registerRoute(
    "/dashboard/results",
    () =>
      renderProtectedPlaceholder(
        "Results",
        "Your tournament results."
      ),
    {
      requiresAuth: true
    }
  );


  registerRoute(
    "/dashboard/notifications",
    () =>
      renderProtectedPlaceholder(
        "Notifications",
        "Your KTMS notifications."
      ),
    {
      requiresAuth: true
    }
  );


  registerRoute(
    "/dashboard/profile",
    () =>
      renderProtectedPlaceholder(
        "Profile",
        "Your player profile."
      ),
    {
      requiresAuth: true
    }
  );


  registerRoute(
    "/dashboard/account",
    () =>
      renderProtectedPlaceholder(
        "Account",
        "Your KTMS account settings."
      ),
    {
      requiresAuth: true
    }
  );


  registerRoute(
    "/dashboard/support",
    () =>
      renderProtectedPlaceholder(
        "Support",
        "KTMS player support."
      ),
    {
      requiresAuth: true
    }

  );

}


async function initializeApplication() {

  registerApplicationRoutes();

  setupNavigationMenu();
  setupLogout();

  setRenderer(
    renderRoute
  );

  startRouter();

  await validateSession();

  await renderCurrentRoute();

}


initializeApplication()
  .catch(
    error => {

      console.error(
        "KTMS application initialization failed:",
        error
      );


      mainContent.innerHTML =
        renderError(
          "KTMS could not start correctly."
        );

    }
  );
