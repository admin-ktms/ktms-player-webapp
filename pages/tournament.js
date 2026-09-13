
import { api } from "../js/api.js";

import {
  setPage,
  escapeHtml,
  formatDate,
  formatCurrency
} from "../js/ui.js";

import {
  navigate
} from "../js/router.js";

import {
  getState,
  setState
} from "../js/state.js";


export async function renderTournament(
  tournamentId
) {

  setPage(`
    <main class="page page-centered">

      <div class="loading-card">
        Loading tournament...
      </div>

    </main>
  `);


  try {

    const result =
      await api.getTournament(
        tournamentId
      );


    const tournament =
      result?.tournament ||
      result;


    setState({
      currentTournament:
        tournament
    });


    const status =
      tournament.tournament_status ||
      "Upcoming";


    const isOpen =
      status.toLowerCase()
        .includes("registration open");


    setPage(`
      <main class="page">

        <section class="tournament-detail">

          <div class="detail-header">

            <button
              class="back-button"
              id="back-button"
            >
              ← BACK
            </button>

            <span class="tournament-id">
              ${escapeHtml(
                tournament.tournament_id
              )}
            </span>

          </div>


          <div class="detail-main">

            <span class="eyebrow">
              ${escapeHtml(
                tournament.tournament_type_id ||
                "KT"
              )}
            </span>

            <h1>
              ${escapeHtml(
                tournament.tournament_name
              )}
            </h1>

            <span class="status-badge status-open">
              ${escapeHtml(status)}
            </span>

          </div>


          <div class="detail-grid">

            <div class="detail-item">
              <span>START</span>
              <strong>
                ${formatDate(
                  tournament.tournament_start_date
                )}
              </strong>
            </div>


            <div class="detail-item">
              <span>END</span>
              <strong>
                ${formatDate(
                  tournament.tournament_end_date
                )}
              </strong>
            </div>


            <div class="detail-item">
              <span>REGISTRATION CLOSES</span>
              <strong>
                ${formatDate(
                  tournament.registration_close_datetime
                )}
              </strong>
            </div>


            <div class="detail-item">
              <span>ENTRY FEE</span>
              <strong>
                ${formatCurrency(
                  tournament.registration_fee
                )}
              </strong>
            </div>


            <div class="detail-item">
              <span>PLAYER CAPACITY</span>
              <strong>
                ${escapeHtml(
                  tournament.maximum_players
                )}
              </strong>
            </div>


            <div class="detail-item">
              <span>AGE</span>
              <strong>
                ${escapeHtml(
                  tournament.minimum_age
                )}
                +
              </strong>
            </div>

          </div>


          <div class="detail-actions">

            ${
              isOpen
                ? `
                  <button
                    class="button button-primary button-large"
                    id="register-button"
                  >
                    REGISTER FOR TOURNAMENT
                  </button>
                `
                : `
                  <div class="notice">
                    Registration is not currently open.
                  </div>
                `
            }

          </div>

        </section>

      </main>
    `);


    document
      .querySelector(
        "#back-button"
      )
      ?.addEventListener(
        "click",
        () => {

          navigate("/");

        }
      );


    document
      .querySelector(
        "#register-button"
      )
      ?.addEventListener(
        "click",
        () => {

          navigate(
            `/register/${encodeURIComponent(
              tournamentId
            )}`
          );

        }
      );


  } catch (error) {

    setPage(`
      <main class="page page-centered">

        <section class="state-card">

          <div class="state-icon">
            !
          </div>

          <h2>
            Tournament unavailable
          </h2>

          <p>
            ${escapeHtml(
              error.message ||
              "This tournament could not be loaded."
            )}
          </p>

          <button
            class="button button-primary"
            id="return-home"
          >
            VIEW TOURNAMENTS
          </button>

        </section>

      </main>
    `);


    document
      .querySelector(
        "#return-home"
      )
      ?.addEventListener(
        "click",
        () => navigate("/")
      );

  }

}
