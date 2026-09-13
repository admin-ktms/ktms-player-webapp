
import {
  setPage
} from "../js/ui.js";


export function renderVerify() {

  setPage(`

    <main class="page page-centered">

      <section class="auth-card">

        <span class="eyebrow">
          VERIFICATION
        </span>

        <h1>
          Enter your code
        </h1>

        <p>
          Enter the 6-digit verification code
          sent to your registered email.
        </p>


        <form id="verify-form">

          <label
            for="otp"
          >
            Verification Code
          </label>

          <input
            id="otp"
            name="otp"
            type="text"
            inputmode="numeric"
            autocomplete="one-time-code"
            maxlength="6"
            required
            placeholder="000000"
          >


          <button
            class="button button-primary button-large"
            type="submit"
          >
            VERIFY
          </button>

        </form>

      </section>

    </main>

  `);

}
