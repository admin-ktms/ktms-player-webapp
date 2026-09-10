const API_VERSION =
  "v1";


/*
 * IMPORTANT:
 *
 * This is the deployed KTMS Public API Web App URL.
 *
 * Do NOT place KTMS_API_KEY here. 
 */
const API_BASE_URL =
  "https://api.kickoffdls.com/";


export class ApiError extends Error {

  constructor(
    message,
    code = "UNKNOWN_ERROR",
    response = null
  ) {

    super(message);

    this.name =
      "ApiError";

    this.code =
      code;

    this.response =
      response;

  }

}


async function request(
  endpoint,
  payload = {},
  options = {}
) {

  const body = {

    endpoint,

    ...payload

  };


  const response =
    await fetch(
      API_BASE_URL,
      {

        method:
          "POST",

        headers: {

          "Content-Type":
            "application/json"

        },

        credentials:
          "include",

        body:
          JSON.stringify(
            body
          ),

        signal:
          options.signal

      }
    );


  let data;


  try {

    data =
      await response.json();

  } catch (error) {

    throw new ApiError(
      "KTMS returned an invalid response.",
      "INVALID_API_RESPONSE"
    );

  }


  if (
    !data ||
    data.apiVersion !==
      API_VERSION
  ) {

    throw new ApiError(
      "KTMS returned an unsupported API version.",
      "UNSUPPORTED_API_VERSION",
      data
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

      data

    );

  }


  return data.data;

}


/* ==========================================================
 * PUBLIC API
 * ======================================================== */

async function getOpenTournaments() {

  return request(
    "tournaments/open"
  );

}


/* ==========================================================
 * ACCOUNT
 * ======================================================== */

async function requestAccountVerification(
  payload
) {

  return request(
    "account/verification/request",
    payload
  );

}


/* ==========================================================
 * AUTHENTICATION
 * ======================================================== */

async function requestLoginCode(
  accountId
) {

  return request(
    "auth/otp/request",
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
    "auth/otp/verify",
    {

      challengeId,

      otp

    }
  );

}


async function validateSession(
  sessionToken
) {

  return request(
    "auth/session/validate",
    {

      sessionToken

    }
  );

}


async function logout(
  sessionToken
) {

  return request(
    "auth/logout",
    {

      sessionToken

    }
  );

}


/* ==========================================================
 * EXPORT
 * ======================================================== */

export const api =
  Object.freeze({

    getOpenTournaments,

    requestAccountVerification,

    requestLoginCode,

    verifyOtp,

    validateSession,

    logout

  });
