
import { api } from "../js/api.js";

import {
  setPage,
  escapeHtml
} from "../js/ui.js";

import {
  tournamentCard,
  bindTournamentCards
} from "../components/tournament-card.js";

import {
  getState,
  setState
} from "../js/state.js";


export async function renderHome() {

  setPage(`
    <main class="page">

      <section class="hero">

        <div class="hero-content">

          <span class="eyebrow">
            KICKOFF TOURNAMENT MANAGEMENT SYSTEM
          </span>

          <h1>
            Play the tournament.
          </h1>

          <p>
            Discover active KTMS tournaments,
            register your squad and follow your
            competition from matchday to completion.
          </p>

          <div class="hero-actions">

            <a
              href="/login"
              class="button button-secondary"
              data-route-link
            >
              LOGIN
            </a>

          </div>

        </div>

      </section>


      <section class="tournament-section">

        <div class="section-heading">

          <div>
            <span class="eyebrow">
              ACTIVE TOURNAMENTS
            </span>

            <h2>
              Enter the competition
            </h2>
          </div>

        </div>


        <div
          id="tournament-list"
          class="tournament-grid"
        >

          <div class="loading-card">
            Loading active tournaments...
          </div>

        </div>

      </section>

    </main>
  `);


  const container =
    document.querySelector(
      "#tournament-list"
    );


  try {

    const result =
      await api.getTournaments();

    const tournaments =
      Array.isArray(result)
        ? result
        : (
            result?.tournaments ||
            result?.items ||
            []
          );


    setState({
      tournaments
    });


    if (!tournaments.length) {

      container.innerHTML = `
        <div class="state-card">
          <div class="state-icon">
            KT
          </div>

          <h3>
            No active tournaments
          </h3>

          <p>
            There are currently no tournaments
            available for registration.
          </p>
        </div>
      `;

      return;

    }


    container.innerHTML =
      tournaments
        .map(
          tournamentCard
        )
        .join("");


    bindTournamentCards();


  } catch (error) {

    container.innerHTML = `
      <div class="state-card">

        <div class="state-icon">
          !
        </div>

        <h3>
          Tournaments unavailable
        </h3>

        <p>
          ${escapeHtml(
            error.message ||
            "Unable to load tournaments."
          )}
        </p>

        <button
          class="button button-primary"
          id="retry-tournaments"
        >
          RETRY
        </button>

      </div>
    `;


    document
      .querySelector(
        "#retry-tournaments"
      )
      ?.addEventListener(
        "click",
        () => renderHome()
      );

  }

}
