
import {
  escapeHtml,
  formatDate,
  formatCurrency
} from "../js/ui.js";

import {
  navigate
} from "../js/router.js";


export function tournamentCard(
  tournament
) {

  const id =
    tournament.tournament_id;

  const name =
    tournament.tournament_name ||
    "KT Tournament";

  const status =
    tournament.tournament_status ||
    "Upcoming";

  const maximum =
    Number(
      tournament.maximum_players || 0
    );


  return `
    <article
      class="tournament-card"
      data-tournament-id="${escapeHtml(id)}"
    >

      <div class="tournament-card-top">

        <span class="tournament-id">
          ${escapeHtml(id)}
        </span>

        <span class="status-badge status-open">
          ${escapeHtml(status)}
        </span>

      </div>


      <div class="tournament-card-body">

        <h2>
          ${escapeHtml(name)}
        </h2>

        <div class="tournament-meta">

          <div class="meta-item">
            <span class="meta-label">
              START
            </span>

            <span class="meta-value">
              ${formatDate(
                tournament.tournament_start_date
              )}
            </span>
          </div>


          <div class="meta-item">
            <span class="meta-label">
              REGISTRATION CLOSES
            </span>

            <span class="meta-value">
              ${formatDate(
                tournament.registration_close_datetime
              )}
            </span>
          </div>


          <div class="meta-item">
            <span class="meta-label">
              ENTRY
            </span>

            <span class="meta-value">
              ${formatCurrency(
                tournament.registration_fee
              )}
            </span>
          </div>


          <div class="meta-item">
            <span class="meta-label">
              PLAYERS
            </span>

            <span class="meta-value">
              ${maximum || "—"}
            </span>
          </div>

        </div>

      </div>


      <div class="tournament-card-footer">

        <button
          class="button button-primary tournament-view-button"
          data-tournament="${escapeHtml(id)}"
        >
          VIEW TOURNAMENT
        </button>

      </div>

    </article>
  `;

}


export function bindTournamentCards() {

  document
    .querySelectorAll(
      "[data-tournament]"
    )
    .forEach(
      button => {

        button.addEventListener(
          "click",
          () => {

            const id =
              button.dataset.tournament;

            if (!id) {
              return;
            }

            navigate(
              `/tournament/${encodeURIComponent(id)}`
            );

          }
        );

      }
    );

}
