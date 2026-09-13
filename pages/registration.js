
import {
  api
} from "../js/api.js";

import {
  getState
} from "../js/state.js";

import {
  navigate
} from "../js/router.js";

import {
  setPage,
  escapeHtml
} from "../js/ui.js";


export async function renderRegistration(
  tournamentId
) {

  const state =
    getState();


  /*
   * Authentication gate.
   *
   * The player must authenticate before
   * submitting a registration request.
   */

  if (!state.session) {

    sessionStorage.setItem(
      "ktms_pending_route",
      `/register/${encodeURIComponent(
        tournamentId
      )}`
    );


    sessionStorage.setItem(
      "ktms_pending_tournament",
      tournamentId
    );


    navigate("/login");

    return;

  }


  setPage(`

    <main class="page page-centered">

      <section class="auth-card">

        <span class="eyebrow">
          TOURNAMENT REGISTRATION
        </span>

        <h1>
          Register your squad
        </h1>

        <p>
          Tournament:
          <strong>
            ${escapeHtml(
              tournamentId
            )}
          </strong>
        </p>


        <form id="registration-form">

          <label
            for="squad-name"
          >
            Squad Name
          </label>

          <input
            id="squad-name"
            name="squadName"
            type="text"
            maxlength="100"
            required
            placeholder="Enter your squad name"
          >


          <label
            for="player-age"
          >
            Age
          </label>

          <input
            id="player-age"
            name="age"
            type="number"
            min="1"
            max="120"
            required
            placeholder="Your age"
          >


          <button
            class="button button-primary button-large"
            type="submit"
          >
            SUBMIT REGISTRATION
          </button>

        </form>

      </section>

    </main>

  `);


  document
    .querySelector(
      "#registration-form"
    )
    ?.addEventListener(
      "submit",
      async event => {

        event.preventDefault();


        const form =
          event.currentTarget;


        const squadName =
          form.squadName.value.trim();


        const age =
          Number(
            form.age.value
          );


        const button =
          form.querySelector(
            "button[type='submit']"
          );


        button.disabled = true;
        button.textContent =
          "SUBMITTING...";


        try {

          await api.createRegistration(
            tournamentId,
            squadName,
            age
          );


          setPage(`

            <main class="page page-centered">

              <section class="state-card">

                <div class="state-icon">
                  ✓
                </div>

                <h2>
                  Registration submitted
                </h2>

                <p>
                  Your registration request has
                  been submitted to KTMS.
                </p>

                <button
                  class="button button-primary"
                  id="return-tournament"
                >
                  RETURN TO TOURNAMENT
                </button>

              </section>

            </main>

          `);


          document
            .querySelector(
              "#return-tournament"
            )
            ?.addEventListener(
              "click",
              () => navigate(
                `/tournament/${encodeURIComponent(
                  tournamentId
                )}`
              )
            );


        } catch (error) {

          button.disabled = false;
          button.textContent =
            "SUBMIT REGISTRATION";


          alert(
            error.message ||
            "Registration could not be submitted."
          );

        }

      }
    );

}
