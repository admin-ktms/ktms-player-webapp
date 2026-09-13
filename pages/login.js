
import {
  setPage
} from "../js/ui.js";


export function renderLogin() {

  setPage(`

    <main class="page page-centered">

      <section class="auth-card">

        <span class="eyebrow">
          PLAYER ACCOUNT
        </span>

        <h1>
          Login to KTMS
        </h1>

        <p>
          Sign in to register for tournaments,
          manage your participation and follow
          your fixtures.
        </p>


        <form id="login-form">

          <label
            for="account-id"
          >
            Account ID / Username
          </label>

          <input
            id="account-id"
            name="accountId"
            type="text"
            autocomplete="username"
            required
            placeholder="Enter your username"
          >


          <button
            class="button button-primary button-large"
            type="submit"
          >
            CONTINUE
          </button>

        </form>


        <div class="auth-note">
          New to KTMS?
          Account verification and sign-up
          will be available through this flow.
        </div>

      </section>

    </main>

  `);

}
