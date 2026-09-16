/* ==========================================================
   KTMS PLAYER APP SHELL
   ----------------------------------------------------------
   Global application frame for the Player Web App.
========================================================== */

const PUBLIC_NAV = [
  {
    label: "Home",
    route: "/"
  },
  {
    label: "Tournaments",
    route: "/tournaments"
  }
];

const PLAYER_NAV = [
  {
    label: "My Tournaments",
    route: "/my-tournaments"
  },
  {
    label: "Fixtures",
    route: "/fixtures"
  },
  {
    label: "Results",
    route: "/results"
  },
  {
    label: "Notifications",
    route: "/notifications"
  }
];

const PLAYER_MORE_NAV = [
  {
    label: "Profile",
    route: "/profile"
  },
  {
    label: "Account & Security",
    route: "/account"
  },
  {
    label: "Support",
    route: "/support"
  }
];

/* ==========================================================
   HELPERS
========================================================== */

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderNavLink(item, activeRoute) {
  const active =
    activeRoute === item.route
      ? " active"
      : "";

  return `
    <a
      href="${item.route}"
      class="app-nav-link${active}"
      data-route="${item.route}"
    >
      ${escapeHtml(item.label)}
    </a>
  `;
}

function renderDesktopPublicNav(activeRoute) {
  return PUBLIC_NAV
    .map(item => renderNavLink(item, activeRoute))
    .join("");
}

function renderDesktopPlayerNav(activeRoute) {
  return PLAYER_NAV
    .map(item => renderNavLink(item, activeRoute))
    .join("");
}

function renderPlayerMoreNav(activeRoute) {
  return PLAYER_MORE_NAV
    .map(item => renderNavLink(item, activeRoute))
    .join("");
}

/* ==========================================================
   PUBLIC HEADER
========================================================== */

function renderPublicHeader(activeRoute) {
  return `
    <header class="app-header">

      <div class="app-header-inner">

        <a
          href="/"
          class="brand"
          data-route="/"
          aria-label="KickOff DLS Player Home"
        >

          <img
            class="brand-logo"
            src="https://kickoffdls.com/wp-content/uploads/2026/08/cropped-107743.jpg"
            alt="KickOff DLS"
          >

          <span class="brand-copy">

            <span class="brand-text">
              KickOff DLS
            </span>

            <span class="brand-subtitle">
              The Ultimate DREAM LEAGUE SOCCER Showdown
            </span>

          </span>

        </a>

        <nav
          class="app-header-nav"
          aria-label="Player navigation"
        >

          ${renderDesktopPublicNav(activeRoute)}

          <a
            href="/login"
            class="btn btn-secondary app-login-button"
            data-route="/login"
          >
            Login
          </a>

        </nav>

        <button
          type="button"
          class="app-mobile-menu-button"
          aria-label="Open navigation"
          aria-expanded="false"
          data-action="toggle-mobile-navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>

    </header>
  `;
}

/* ==========================================================
   AUTHENTICATED HEADER
========================================================== */

function renderPlayerHeader(
  activeRoute,
  player = {}
) {
  const displayName =
    player.displayName ||
    player.managerName ||
    player.username ||
    "Player";

  return `
    <header class="app-header">

      <div class="app-header-inner">

        <a
          href="/"
          class="brand"
          data-route="/"
          aria-label="KickOff DLS Player Home"
        >

          <img
            class="brand-logo"
            src="https://kickoffdls.com/wp-content/uploads/2026/08/cropped-107743.jpg"
            alt="KickOff DLS"
          >

          <span class="brand-copy">

            <span class="brand-text">
              KickOff DLS
            </span>

            <span class="brand-subtitle">
              Player
            </span>

          </span>

        </a>

        <nav
          class="app-header-nav app-player-nav"
          aria-label="Player navigation"
        >

          ${renderDesktopPlayerNav(activeRoute)}

          <div class="app-player-menu">

            <button
              type="button"
              class="app-player-menu-button"
              aria-expanded="false"
              data-action="toggle-player-menu"
            >

              <span class="app-player-avatar">
                ${escapeHtml(displayName.charAt(0).toUpperCase())}
              </span>

              <span class="app-player-name">
                ${escapeHtml(displayName)}
              </span>

              <span
                class="app-player-menu-chevron"
                aria-hidden="true"
              >
                ▾
              </span>

            </button>

            <div
              class="app-player-menu-dropdown"
              hidden
            >

              ${renderPlayerMoreNav(activeRoute)}

              <button
                type="button"
                class="app-nav-action"
                data-action="logout"
              >
                Log Out
              </button>

            </div>

          </div>

        </nav>

        <button
          type="button"
          class="app-mobile-menu-button"
          aria-label="Open player navigation"
          aria-expanded="false"
          data-action="toggle-mobile-navigation"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>

    </header>
  `;
}

/* ==========================================================
   MOBILE NAVIGATION
========================================================== */

function renderMobileNavigation({
  authenticated,
  activeRoute
}) {
  const primaryItems = authenticated
    ? [
        PUBLIC_NAV[0],
        PUBLIC_NAV[1],
        PLAYER_NAV[0],
        PLAYER_NAV[1]
      ]
    : PUBLIC_NAV;

  const moreItems = authenticated
    ? [
        PLAYER_NAV[2],
        PLAYER_NAV[3],
        ...PLAYER_MORE_NAV
      ]
    : [];

  return `
    <div
      class="app-mobile-navigation"
      data-mobile-navigation
      hidden
    >

      <div class="app-mobile-navigation-inner">

        <nav
          class="app-mobile-primary-nav"
          aria-label="Mobile player navigation"
        >

          ${primaryItems
            .map(item =>
              renderNavLink(item, activeRoute)
            )
            .join("")}

        </nav>

        ${
          authenticated
            ? `
              <div class="app-mobile-section">

                <div class="app-mobile-section-title">
                  Player
                </div>

                ${moreItems
                  .map(item =>
                    renderNavLink(item, activeRoute)
                  )
                  .join("")}

                <button
                  type="button"
                  class="app-nav-action"
                  data-action="logout"
                >
                  Log Out
                </button>

              </div>
            `
            : `
              <div class="app-mobile-section">

                <a
                  href="/login"
                  class="btn btn-primary app-mobile-login"
                  data-route="/login"
                >
                  Player Login
                </a>

              </div>
            `
        }

      </div>

    </div>
  `;
}

/* ==========================================================
   PLAYER BOTTOM NAVIGATION
========================================================== */

function renderMobileBottomNavigation({
  authenticated,
  activeRoute
}) {
  if (!authenticated) {
    return "";
  }

  const items = [
    {
      label: "Home",
      route: "/"
    },
    {
      label: "Tournaments",
      route: "/tournaments"
    },
    {
      label: "My",
      route: "/my-tournaments"
    },
    {
      label: "Fixtures",
      route: "/fixtures"
    },
    {
      label: "More",
      route: "/notifications"
    }
  ];

  return `
    <nav
      class="app-bottom-nav"
      aria-label="Player quick navigation"
    >

      ${items
        .map(item => {
          const active =
            activeRoute === item.route
              ? " active"
              : "";

          return `
            <a
              href="${item.route}"
              class="app-bottom-nav-link${active}"
              data-route="${item.route}"
            >
              <span>
                ${escapeHtml(item.label)}
              </span>
            </a>
          `;
        })
        .join("")}

    </nav>
  `;
}

/* ==========================================================
   FOOTER
========================================================== */

function renderFooter() {
  return `
    <footer class="app-footer">

      <div class="app-footer-inner">

        <div class="app-footer-navigation">

          <a
            href="/"
            class="app-footer-link"
            data-route="/"
          >
            Return to Home
          </a>

          <a
            href="https://www.kickoffdls.com"
            class="app-footer-link"
          >
            KickOff DLS website
          </a>

        </div>

        <div class="app-footer-meta">

          <span>
            Powered by KTMS
          </span>

        </div>

      </div>

    </footer>
  `;
}

/* ==========================================================
   GLOBAL UI MOUNTS
========================================================== */

function renderGlobalUi() {
  return `
    <div
      id="ktms-toast-container"
      class="ktms-toast-container"
      aria-live="polite"
      aria-atomic="true"
    ></div>

    <div
      id="ktms-modal-root"
      class="ktms-modal-root"
    ></div>

    <div
      id="ktms-loading-root"
      class="ktms-loading-root"
      aria-live="polite"
      aria-busy="false"
    ></div>
  `;
}

/* ==========================================================
   APP SHELL
========================================================== */

export function renderAppShell({
  content = "",
  authenticated = false,
  activeRoute = "",
  player = {}
} = {}) {
  const header = authenticated
    ? renderPlayerHeader(
        activeRoute,
        player
      )
    : renderPublicHeader(
        activeRoute
      );

  return `
    <div
      class="app-shell"
      data-authenticated="${authenticated}"
    >

      ${header}

      ${renderMobileNavigation({
        authenticated,
        activeRoute
      })}

      <main
        class="app-main"
        id="player-app-main"
      >
        ${content}
      </main>

      ${renderFooter()}

      ${renderMobileBottomNavigation({
        authenticated,
        activeRoute
      })}

      ${renderGlobalUi()}

    </div>
  `;
}

/* ==========================================================
   SHELL INTERACTION
========================================================== */

export function initializeAppShell() {
  const mobileButtons =
    document.querySelectorAll(
      '[data-action="toggle-mobile-navigation"]'
    );

  const mobileNavigation =
    document.querySelector(
      "[data-mobile-navigation]"
    );

  mobileButtons.forEach(button => {
    button.addEventListener(
      "click",
      () => {
        if (!mobileNavigation) {
          return;
        }

        const isOpen =
          !mobileNavigation.hidden;

        mobileNavigation.hidden =
          isOpen;

        button.setAttribute(
          "aria-expanded",
          String(!isOpen)
        );
      }
    );
  });

  const playerMenuButton =
    document.querySelector(
      '[data-action="toggle-player-menu"]'
    );

  const playerMenuDropdown =
    document.querySelector(
      ".app-player-menu-dropdown"
    );

  if (
    playerMenuButton &&
    playerMenuDropdown
  ) {
    playerMenuButton.addEventListener(
      "click",
      () => {
        const isOpen =
          !playerMenuDropdown.hidden;

        playerMenuDropdown.hidden =
          isOpen;

        playerMenuButton.setAttribute(
          "aria-expanded",
          String(!isOpen)
        );
      }
    );
  }
}
