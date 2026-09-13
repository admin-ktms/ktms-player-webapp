import { CONFIG } from "./config.js";


export class ApiError extends Error {

  constructor(
    message,
    code = "API_ERROR",
    status = 0
  ) {

    super(message);

    this.name = "ApiError";
    this.code = code;
    this.status = status;

  }

}


async function request(
  action,
  payload = {}
) {

  let response;

  try {

    response = await fetch(
      CONFIG.API_BASE_URL,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        credentials: "include",

        body: JSON.stringify({
          action,
          ...payload
        })
      }
    );

  } catch (error) {

    throw new ApiError(
      "Unable to connect to KTMS.",
      "NETWORK_ERROR"
    );

  }


  let data;

  try {

    data = await response.json();

  } catch (error) {

    throw new ApiError(
      "KTMS returned an invalid response.",
      "INVALID_API_RESPONSE",
      response.status
    );

  }


  if (
    data?.apiVersion !==
    CONFIG.API_VERSION
  ) {

    throw new ApiError(
      "Unsupported KTMS API version.",
      "UNSUPPORTED_API_VERSION",
      response.status
    );

  }


  if (
    !response.ok ||
    data.success !== true
  ) {

    throw new ApiError(
      data?.error?.message ||
      "The KTMS request could not be completed.",

      data?.error?.code ||
      "API_REQUEST_FAILED",

      response.status
    );

  }


  return data.data;

}


/* ==========================================================
   PUBLIC TOURNAMENT API
========================================================== */

async function getTournaments(
  status = null
) {

  return request(
    "tournaments.list",
    status
      ? { status }
      : {}
  );

}


async function getTournament(
  tournamentId
) {

  return request(
    "tournament.get",
    {
      tournamentId
    }
  );

}


/* ==========================================================
   AUTHENTICATION
========================================================== */

async function requestLoginCode(
  accountId
) {

  return request(
    "auth.otp.request",
    {
      accountId
    }
  );

}


async function verifyOtp(
  challengeId,
  otp
) {

  return request(
    "auth.otp.verify",
    {
      challengeId,
      otp
    }
  );

}


async function validateSession(
  sessionToken = null
) {

  return request(
    "auth.session.validate",
    sessionToken
      ? { sessionToken }
      : {}
  );

}


async function logout(
  sessionToken = null
) {

  return request(
    "auth.logout",
    sessionToken
      ? { sessionToken }
      : {}
  );

}


/* ==========================================================
   REGISTRATION
========================================================== */

async function createRegistration(
  tournamentId,
  squadName,
  age
) {

  return request(
    "registration.create",
    {
      tournamentId,
      squadName,
      age
    }
  );

}


export const api = Object.freeze({

  getTournaments,
  getTournament,

  requestLoginCode,
  verifyOtp,
  validateSession,
  logout,

  createRegistration

});
