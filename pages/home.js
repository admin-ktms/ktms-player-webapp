import { api } from "../js/api.js";
import { renderTournamentCard } from "../components/tournament-card.js";

export async function renderHome() {
  const app = document.querySelector("#app");

  app.innerHTML = `
    <div class="app-shell">

      <header class="app-header">
        <div class="app-header-inner">

          <a
            href="/"
            class="brand"
            data-route="/"
          >
            <span class="brand-mark">KD</span>

            <span>
              <span class="brand-text">
                KickOff DLS
              </span>

              <span class="brand-subtitle">
                Competitive Football
              </span>
            </span>
          </a>

          <nav>
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

        <section class="hero">

          <div class="hero-content">

            <div class="eyebrow">
              KickOff DLS
            </div>

            <h1 class="hero-title">
              The competition
              <br>
              <span>is on.</span>
            </h1>

            <p class="page-lead">
              Find your next tournament, enter your squad,
              and compete in structured Dream League Soccer
              competition built for players looking for more.
            </p>

            <div class="hero-actions">

              <a
                href="#active-tournaments"
                class="btn btn-primary"
              >
                Explore Tournaments
              </a>

              <a
                href="/login"
                class="btn btn-secondary"
                data-route="/login"
              >
                Player Login
              </a>

            </div>

          </div>

        </section>

        <section
          id="active-tournaments"
          class="page-section"
        >

          <div class="section-header">

            <div>
              <div class="eyebrow">
                Competition
              </div>

              <h2 class="section-title">
                Active Tournaments
              </h2>
            </div>

          </div>

          <div id="tournament-list">
            <div class="loading-state">
              Loading competitions...
            </div>
          </div>

        </section>

        <section class="page-section">

          <div class="section-header">
            <div>
              <div class="eyebrow">
                Why KickOff DLS
              </div>

              <h2 class="section-title">
                Built for competition
              </h2>
            </div>
          </div>

          <div class="competition-strip">

            <div class="competition-strip-item">
              <span class="competition-strip-label">
                Compete
              </span>

              <span class="competition-strip-value">
                Structured tournaments
              </span>
            </div>

            <div class="competition-strip-item">
              <span class="competition-strip-label">
                Follow
              </span>

              <span class="competition-strip-value">
                Fixtures & results
              </span>
            </div>

            <div class="competition-strip-item">
              <span class="competition-strip-label">
                Prove
              </span>

              <span class="competition-strip-value">
                Rankings & recognition
              </span>
            </div>

          </div>

        </section>

      </main>

      <footer class="app-footer">
        <div class="app-footer-inner">

          <span>
            KickOff DLS
          </span>

          <span>
            Powered by KTMS
          </span>

        </div>
      </footer>

    </div>
  `;

  await loadTournaments();
}

async function loadTournaments() {
  const container =
    document.querySelector("#tournament-list");

  try {
    const response = await api(
      "tournaments.list",
      {}
    );

    const tournaments =
      extractTournaments(response);

    if (!tournaments.length) {
      container.innerHTML = `
        <div class="empty-state">
          <strong>No active competitions.</strong>
          <p>
            There are currently no tournaments available
            for registration.
          </p>
        </div>
      `;

      return;
    }

    container.innerHTML = `
      <div class="tournament-grid">
        ${tournaments
          .map(renderTournamentCard)
          .join("")}
      </div>
    `;

    bindTournamentActions();

  } catch (error) {
    console.error(
      "Failed to load tournaments:",
      error
    );

    container.innerHTML = `
      <div class="error-state">
        <strong>
          Competition data unavailable.
        </strong>

        <p>
          We could not load the current tournaments.
          Please try again.
        </p>

        <button
          type="button"
          class="btn btn-secondary"
          id="retry-tournaments"
          style="margin-top:16px;"
        >
          Retry
        </button>
      </div>
    `;

    document
      .querySelector("#retry-tournaments")
      ?.addEventListener(
        "click",
        loadTournaments
      );
  }
}

function bindTournamentActions() {
  document
    .querySelectorAll(
      '[data-action="open-tournament"]'
    )
    .forEach((button) => {
      button.addEventListener(
        "click",
        () => {
          const tournamentId =
            button.dataset.tournamentId;

          if (!tournamentId) {
            return;
          }

          window.location.href =
            `/tournament?id=${encodeURIComponent(
              tournamentId
            )}`;
        }
      );
    });
}

function extractTournaments(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.tournaments)) {
    return response.tournaments;
  }

  if (Array.isArray(response?.data?.tournaments)) {
    return response.data.tournaments;
  }

  return [];
}
