import {
  registerRoute,
  resolveRoute
} from "./router.js";

import {
  renderHome
} from "../pages/home.js";

import {
  renderLogin
} from "../pages/login.js";

import {
  renderVerify
} from "../pages/verify.js";

import {
  renderTournament
} from "../pages/tournament.js";

import {
  renderRegistration
} from "../pages/registration.js";

import {
  restoreSession
} from "./auth.js";


/* ==========================================================
   ROUTES
========================================================== */

registerRoute(
  "/",
  renderHome
);


registerRoute(
  "/login",
  renderLogin
);


registerRoute(
  "/verify",
  renderVerify
);


registerRoute(
  "/tournament/:id",
  renderTournament
);


registerRoute(
  "/register/:id",
  renderRegistration
);


/* ==========================================================
   APPLICATION START
========================================================== */

async function startApp() {

  await restoreSession();

  await resolveRoute();

}


startApp();
