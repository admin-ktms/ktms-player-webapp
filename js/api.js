const API_VERSION = "v1";

/*
 * IMPORTANT:
 *
 * Replace this placeholder only with the deployed
 * KTMS API endpoint when the browser/API transport
 * has been validated.
 *
 * Never place KTMS_API_KEY here.
 */
const API_BASE_URL =
  "REPLACE_WITH_KTMS_API_WEB_APP_URL";


export class ApiError extends Error {

  constructor(
    message,
    code = "UNKNOWN_ERROR",
    response = null
  ) {

    super(message);

    this.name = "ApiError";
    this.code = code;
    this.response = response;

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


  const response = await fetch(
    API_BASE_URL,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      credentials: "include",

      body: JSON.stringify(body),

      signal: options.signal
    }
  );


  let data;

  try {

    data = await response.json();

  } catch (error) {

    throw new ApiError(
      "KTMS returned an invalid response.",
      "INVALID_API_RESPONSE"
    );

  }


  if (!data || data.apiVersion !== API_VERSION) {

    throw new ApiError(
      "KTMS returned an unsupported API version.",
      "UNSUPPORTED_API_VERSION",
      data
    );

  }


  if (!response.ok || data.success !== true) {

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


export const api = Object.freeze({

  async getOpenTournaments() {

    return request(
      "tournaments/open"
    );

  },


  async requestAccountVerification(
    payload
  ) {

    return request(
      "account/verification/request",
      payload
    );

  },


  async requestLoginCode(
    accountId
  ) {

    return request(
      "auth/otp/request",
      {
        accountId
      }
    );

  },


  async verifyOtp(
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

  },


  async validateSession(
    sessionToken
  ) {

    return request(
      "auth/session/validate",
      {
        sessionToken
      }
    );

  },


  async logout(
    sessionToken
  ) {

    return request(
      "auth/logout",
      {
        sessionToken
      }
    );

  }

});
