export function renderAppShell({
  content,
  active = ""
}) {
  return `
    <div class="app-shell">

      <header class="app-header">
        <div class="app-header-inner">

          <a
            href="/"
            class="brand"
            data-route="/"
            aria-label="Return to KickOff DLS Player Home"
          >
            <img
              class="brand-logo"
              src="https://kickoffdls.com/wp-content/uploads/2026/08/cropped-107743.jpg"
              alt="KickOff DLS"
            >

            <span>
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

            <a
              href="/"
              class="app-nav-link ${active === "home" ? "active" : ""}"
              data-route="/"
            >
              Home
            </a>

            <a
              href="/login"
              class="btn btn-secondary"
              data-route="/login"
            >
              Login
            </a>

          </nav>

        </div>
      </header>

      <main class="app-main">
        ${content}
      </main>

      <footer class="app-footer">

        <div class="app-footer-inner">

          <a
            href="/"
            class="app-footer-home"
            data-route="/"
          >
            Return to Home
          </a>

          <a
            href="https://www.kickoffdls.com"
            class="app-footer-website"
            target="_blank"
            rel="noopener noreferrer"
          >
            Return to KickOff DLS website
          </a>

          <span>
            Powered by KTMS
          </span>

        </div>

      </footer>

    </div>
  `;
}
