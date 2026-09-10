import {
  startRouter,
  registerRoute,
  setRenderer,
  renderCurrentRoute
} from "./router.js";

import {
  api
} from "./api.js";

import {
  validateSession,
  isAuthenticated,
  logout,
  requestLoginCode,
  requestAccountVerification,
  verifyOtp,
  getAuthChallenge,
  clearAuthChallenge
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
          Currently available KickOff tournaments.
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


  const tournamentList =
    document.getElementById(
      "tournament-list"
    );


  if (!tournamentList) {
    return;
  }


  api.getOpenTournaments()
    .then(
      data => {

        const tournaments =
          Array.isArray(
            data?.tournaments
          )
            ? data.tournaments
            : [];


        if (
          tournaments.length === 0
        ) {

          tournamentList.innerHTML = `
            <section
              class="empty-state"
              aria-live="polite"
            >
              <h2 class="card-title">
                No active tournaments
              </h2>

              <p class="card-text">
                There are currently no tournaments
                open for registration.
              </p>
            </section>
          `;

          return;
        }


        tournamentList.innerHTML =
          tournaments
            .map(
              tournament => `

                <article
                  class="tournament-card"
                >

                  <div
                    class="tournament-card-header"
                  >

                    <span
                      class="status-pill status-pill-primary"
                    >
                      ${tournament.status}
                    </span>

                    <h2
                      class="card-title"
                    >
                      ${tournament.name}
                    </h2>

                  </div>


                  <div
                    class="tournament-card-details"
                  >

                    <p class="card-text">
                      Tournament ID:
                      ${tournament.tournamentId}
                    </p>

                    <p class="card-text">
                      Type:
                      ${tournament.typeId}
                    </p>

                    <p class="card-text">
                      Registration closes:
                      ${tournament.registrationEnd || "Not specified"}
                    </p>

                    <p class="card-text">
                      Tournament dates:
                      ${tournament.startDate || "Not specified"}
                      –
                      ${tournament.endDate || "Not specified"}
                    </p>

                  </div>


                  <div
                    class="tournament-card-actions"
                  >
                    <span
                      class="card-text"
                    >
                      Tournament portal coming next.
                    </span>
                  </div>>

                </article>

              `
            )
            .join("");

      }
    )
    .catch(
      error => {

        console.error(
          "KTMS tournament discovery error:",
          error
        );


        tournamentList.innerHTML =
          renderError(
            error?.message ||
            "Unable to load tournaments right now."
          );

      }
    );

}


function getReturnPath() {

  const params =
    new URLSearchParams(
      window.location.search
    );

  return (
    params.get("returnTo") ||
    "/dashboard"
  );

}


function navigateAfterLogin() {

  const returnPath =
    getReturnPath();


  let destination =
    "/dashboard";


  try {

    const decoded =
      decodeURIComponent(
        returnPath
      );


    /*
     * Only allow internal KTMS application routes.
     *
     * External URLs are never accepted as
     * post-login destinations.
     */

    if (
      decoded.startsWith("/")
    ) {

      destination =
        decoded;

    }

  } catch (error) {

    destination =
      "/dashboard";

  }


  window.history.pushState(
    {},
    "",
    destination
  );


  renderCurrentRoute();

}


function renderAuthMessage(
  message,
  type = "error"
) {

  if (!message) {
    return "";
  }


  return `

    <div
      class="auth-message auth-message-${type}"
      role="alert"
    >

      ${message}

    </div>

  `;

}


function escapeHtml(
  value
) {

  return String(
    value ?? ""
  )
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


function renderLogin() {

  const challenge =
    getAuthChallenge();


  if (challenge) {

    renderOtpScreen(
      challenge
    );

    return;

  }


  mainContent.innerHTML = `

    <section class="page">

      <header class="page-header">

        <span class="status-pill status-pill-primary">
          KTMS PLAYER
        </span>

        <h1 class="page-title">
          Player Login
        </h1>

        <p class="page-description">
          Sign in to your KTMS player account using
          a one-time verification code.
        </p>

      </header>


      <div class="card auth-card">

        <form
          id="login-form"
          novalidate
        >

          <div class="form-field">

            <label
              for="login-account-id"
              class="form-label"
            >
              Username
            </label>

            <input
              id="login-account-id"
              name="accountId"
              type="text"
              class="form-input"
              autocomplete="username"
              required
            >

          </div>


          <div
            id="login-message"
          ></div>


          <button
            type="submit"
            class="button button-primary"
            id="login-submit"
          >
            Send Verification Code
          </button>

        </form>


        <div class="auth-divider">
          <span>New to KTMS?</span>
        </div>


        <button
          type="button"
          class="button button-secondary"
          id="show-register"
        >
          Create Player Account
        </button>

      </div>

    </section>

  `;


  const form =
    document.getElementById(
      "login-form"
    );


  const submit =
    document.getElementById(
      "login-submit"
    );


  const message =
    document.getElementById(
      "login-message"
    );


  form.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      const formData =
        new FormData(
          form
        );


      const accountId =
        String(
          formData.get(
            "accountId"
          ) || ""
        ).trim();


      if (!accountId) {

        message.innerHTML =
          renderAuthMessage(
            "Enter your KTMS username."
          );

        return;

      }


      submit.disabled =
        true;

      submit.textContent =
        "Sending...";


      message.innerHTML = "";


      try {

        await requestLoginCode(
          accountId
        );


        showToast(
          "Verification code sent."
        );


        renderCurrentRoute();


      } catch (error) {

        console.error(
          "KTMS login request failed:",
          error
        );


        message.innerHTML =
          renderAuthMessage(
            error.message ||
              "We could not send the verification code."
          );


        submit.disabled =
          false;

        submit.textContent =
          "Send Verification Code";

      }

    }
  );


  document
    .getElementById(
      "show-register"
    )
    .addEventListener(
      "click",
      () => {

        renderRegister();

      }
    );

}

function renderOtpScreen(
  challenge
) {

  mainContent.innerHTML = `

    <section class="page">

      <header class="page-header">

        <span class="status-pill status-pill-primary">
          VERIFICATION
        </span>

        <h1 class="page-title">
          Enter verification code
        </h1>

        <p class="page-description">
          Enter the 6-digit code sent to the
          email address associated with your
          KTMS account.
        </p>

      </header>


      <div class="card auth-card">

        <form
          id="otp-form"
          novalidate
        >

          <div class="form-field">

            <label
              for="otp-code"
              class="form-label"
            >
              Verification Code
            </label>

            <input
              id="otp-code"
              name="otp"
              type="text"
              class="form-input otp-input"
              inputmode="numeric"
              autocomplete="one-time-code"
              maxlength="6"
              pattern="[0-9]{6}"
              required
            >

          </div>


          <div
            id="otp-message"
          ></div>


          <button
            type="submit"
            class="button button-primary"
            id="otp-submit"
          >
            Verify & Continue
          </button>

        </form>


        <button
          type="button"
          class="button button-secondary"
          id="otp-cancel"
        >
          Use Another Account
        </button>

      </div>

    </section>

  `;


  const form =
    document.getElementById(
      "otp-form"
    );


  const submit =
    document.getElementById(
      "otp-submit"
    );


  const message =
    document.getElementById(
      "otp-message"
    );


  const input =
    document.getElementById(
      "otp-code"
    );


  input.focus();


  form.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      const otp =
        input.value
          .replace(/\D/g, "")
          .slice(0, 6);


      if (
        !/^\d{6}$/.test(
          otp
        )
      ) {

        message.innerHTML =
          renderAuthMessage(
            "Enter the 6-digit verification code."
          );

        input.focus();

        return;

      }


      submit.disabled =
        true;

      submit.textContent =
        "Verifying...";


      message.innerHTML = "";


      try {

        await verifyOtp(
          challenge.challengeId,
          otp
        );


        showToast(
          "You are now signed in."
        );


        navigateAfterLogin();


      } catch (error) {

        console.error(
          "KTMS OTP verification failed:",
          error
        );


        message.innerHTML =
          renderAuthMessage(
            error.message ||
              "The verification code could not be verified."
          );


        submit.disabled =
          false;

        submit.textContent =
          "Verify & Continue";

        input.select();

      }

    }
  );


  document
    .getElementById(
      "otp-cancel"
    )
    .addEventListener(
      "click",
      () => {

        clearAuthChallenge();

        renderCurrentRoute();

      }
    );

}

function renderRegister() {

  mainContent.innerHTML = `

    <section class="page">

      <header class="page-header">

        <span class="status-pill status-pill-primary">
          NEW PLAYER
        </span>

        <h1 class="page-title">
          Create your KTMS account
        </h1>

        <p class="page-description">
          Your details will be verified before
          your player account is created or linked
          to an existing KTMS player identity.
        </p>

      </header>


      <div class="card auth-card">

        <form
          id="register-form"
          novalidate
        >

          <div class="form-field">

            <label
              for="register-manager-name"
              class="form-label"
            >
              Manager Name
            </label>

            <input
              id="register-manager-name"
              name="managerName"
              type="text"
              class="form-input"
              autocomplete="name"
              required
            >

          </div>


          <div class="form-field">

            <label
              for="register-email"
              class="form-label"
            >
              Email Address
            </label>

            <input
              id="register-email"
              name="emailAddress"
              type="email"
              class="form-input"
              autocomplete="email"
              required
            >

          </div>


          <div class="form-field">

            <label
              for="register-whatsapp"
              class="form-label"
            >
              WhatsApp Number
            </label>

            <input
              id="register-whatsapp"
              name="whatsAppNumber"
              type="tel"
              class="form-input"
              autocomplete="tel"
              required
            >

          </div>


          <div class="form-field">

            <label
              for="register-account-id"
              class="form-label"
            >
              Username
            </label>

            <input
              id="register-account-id"
              name="accountId"
              type="text"
              class="form-input"
              autocomplete="username"
              required
            >

          </div>


          <div
            id="register-message"
          ></div>


          <button
            type="submit"
            class="button button-primary"
            id="register-submit"
          >
            Send Verification Code
          </button>

        </form>


        <button
          type="button"
          class="button button-secondary"
          id="register-cancel"
        >
          Back to Login
        </button>

      </div>

    </section>

  `;


  const form =
    document.getElementById(
      "register-form"
    );


  const submit =
    document.getElementById(
      "register-submit"
    );


  const message =
    document.getElementById(
      "register-message"
    );


  form.addEventListener(
    "submit",
    async event => {

      event.preventDefault();


      const formData =
        new FormData(
          form
        );


      const payload = {

        managerName:
          String(
            formData.get(
              "managerName"
            ) || ""
          ).trim(),

        emailAddress:
          String(
            formData.get(
              "emailAddress"
            ) || ""
          ).trim(),

        whatsAppNumber:
          String(
            formData.get(
              "whatsAppNumber"
            ) || ""
          ).trim(),

        accountId:
          String(
            formData.get(
              "accountId"
            ) || ""
          ).trim()

      };


      if (
        !payload.managerName ||
        !payload.emailAddress ||
        !payload.whatsAppNumber ||
        !payload.accountId
      ) {

        message.innerHTML =
          renderAuthMessage(
            "Complete all required fields."
          );

        return;

      }


      submit.disabled =
        true;

      submit.textContent =
        "Sending...";


      message.innerHTML = "";


      try {

        await requestAccountVerification(
          payload
        );


        showToast(
          "Verification code sent."
        );


        renderCurrentRoute();


      } catch (error) {

        console.error(
          "KTMS account verification request failed:",
          error
        );


        message.innerHTML =
          renderAuthMessage(
            error.message ||
              "We could not start account verification."
          );


        submit.disabled =
          false;

        submit.textContent =
          "Send Verification Code";

      }

    }
  );


  document
    .getElementById(
      "register-cancel"
    )
    .addEventListener(
      "click",
      () => {

        clearAuthChallenge();

        renderCurrentRoute();

      }
    );

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

    const returnPath =
      encodeURIComponent(
        path
      );


    window.history.replaceState(
      {},
      "",
      `/login?returnTo=${returnPath}`
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

  /*
   * ======================================================
   * CANONICAL ITEM 5 ROUTES
   * ======================================================
   */

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
    "/my-tournaments",
    renderDashboard,
    {
      requiresAuth: true
    }
  );


  registerRoute(
    "/fixtures",
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
    "/results",
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
    "/notifications",
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
    "/profile",
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
    "/account",
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
    "/support",
    () =>
      renderProtectedPlaceholder(
        "Support",
        "KTMS player support."
      ),
    {
      requiresAuth: true
    }
  );


  /*
   * ======================================================
   * LEGACY 5A ROUTE COMPATIBILITY
   * ======================================================
   *
   * Keep the old dashboard URLs working temporarily.
   * These are compatibility routes only.
   */

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