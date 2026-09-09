import {
  api,
  ApiError
} from "./api.js";

import {
  getState,
  setAuthState,
  clearAuthState
} from "./state.js";


const SESSION_STORAGE_KEY =
  "ktms_player_session";

const AUTH_CHALLENGE_STORAGE_KEY =
  "ktms_auth_challenge";


/* ==========================================================
 * SESSION
 * ======================================================== */

export function getSessionToken() {

  return sessionStorage.getItem(
    SESSION_STORAGE_KEY
  );

}


export function setSessionToken(
  sessionToken
) {

  if (!sessionToken) {

    throw new Error(
      "KTMS did not return a valid session token."
    );

  }

  sessionStorage.setItem(
    SESSION_STORAGE_KEY,
    sessionToken
  );

}


export function clearSessionToken() {

  sessionStorage.removeItem(
    SESSION_STORAGE_KEY
  );

}


/* ==========================================================
 * AUTH CHALLENGE
 * ======================================================== */

export function getAuthChallenge() {

  const raw =
    sessionStorage.getItem(
      AUTH_CHALLENGE_STORAGE_KEY
    );

  if (!raw) {
    return null;
  }

  try {

    return JSON.parse(
      raw
    );

  } catch (error) {

    clearAuthChallenge();

    return null;

  }

}


export function setAuthChallenge(
  challenge
) {

  if (
    !challenge ||
    !challenge.challengeId
  ) {

    throw new Error(
      "A valid KTMS authentication challenge is required."
    );

  }

  sessionStorage.setItem(
    AUTH_CHALLENGE_STORAGE_KEY,
    JSON.stringify(
      challenge
    )
  );

}


export function clearAuthChallenge() {

  sessionStorage.removeItem(
    AUTH_CHALLENGE_STORAGE_KEY
  );

}


/* ==========================================================
 * EXISTING ACCOUNT
 * ======================================================== */

export async function requestLoginCode(
  accountId
) {

  const result =
    await api.requestLoginCode(
      accountId
    );


  /*
   * KTMS API response:
   *
   * data.authentication
   *
   * {
   *   success: true,
   *   challengeId: "...",
   *   expiresDateTime: "..."
   * }
   */

  const authentication =
    result?.authentication;


  if (
    !authentication ||
    !authentication.challengeId
  ) {

    throw new ApiError(
      "KTMS did not return a valid authentication challenge.",
      "INVALID_AUTH_RESPONSE",
      result
    );

  }


  setAuthChallenge({

    challengeId:
      authentication.challengeId,

    expiresDateTime:
      authentication.expiresDateTime,

    accountId:
      accountId

  });


  return authentication;

}


/* ==========================================================
 * NEW ACCOUNT / EXISTING PLAYER CLAIM
 * ======================================================== */

export async function requestAccountVerification(
  payload
) {

  const result =
    await api.requestAccountVerification(
      payload
    );


  /*
   * KTMS API response:
   *
   * data.verification
   */

  const verification =
    result?.verification;


  if (
    !verification ||
    !verification.challengeId
  ) {

    throw new ApiError(
      "KTMS did not return a valid verification challenge.",
      "INVALID_VERIFICATION_RESPONSE",
      result
    );

  }


  setAuthChallenge({

    challengeId:
      verification.challengeId,

    expiresDateTime:
      verification.expiresDateTime,

    accountId:
      payload.accountId

  });


  return verification;

}


/* ==========================================================
 * OTP VERIFICATION
 * ======================================================== */

export async function verifyOtp(
  challengeId,
  otp
) {

  const result =
    await api.verifyOtp(
      challengeId,
      otp
    );


  /*
   * KTMS API response:
   *
   * data.authentication
   *
   * authentication.session.Session_Token
   */

  const authentication =
    result?.authentication;


  if (
    !authentication
  ) {

    throw new ApiError(
      "KTMS did not return authentication data.",
      "INVALID_AUTH_RESPONSE",
      result
    );

  }


  const session =
    authentication.session;


  if (
    !session ||
    !session.Session_Token
  ) {

    throw new ApiError(
      "KTMS authentication succeeded without returning a valid session.",
      "INVALID_SESSION_RESPONSE",
      result
    );

  }


  setSessionToken(
    session.Session_Token
  );


  clearAuthChallenge();


  setAuthState({

    authenticated:
      true,

    player:
      authentication.identity ||
      null,

    account:
      authentication.identity
        ? {
            accountId:
              authentication.identity.accountId
          }
        : null

  });


  return authentication;

}


/* ==========================================================
 * SESSION VALIDATION
 * ======================================================== */

export async function validateSession() {

  const sessionToken =
    getSessionToken();


  if (!sessionToken) {

    clearAuthState();

    return {
      authenticated: false
    };

  }


  try {

    const result =
      await api.validateSession(
        sessionToken
      );


    if (
      !result ||
      result.authenticated !== true ||
      !result.player
    ) {

      throw new ApiError(
        "KTMS returned an invalid session response.",
        "INVALID_SESSION_RESPONSE",
        result
      );

    }


    setAuthState({

      authenticated:
        true,

      player:
        result.player,

      account:
        {
          accountId:
            result.player.accountId
        }

    });


    return {

      authenticated:
        true,

      player:
        result.player

    };


  } catch (error) {

    clearSessionToken();
    clearAuthState();

    return {

      authenticated:
        false,

      error

    };

  }

}


/* ==========================================================
 * AUTH STATE
 * ======================================================== */

export function isAuthenticated() {

  return (
    getState()
      .auth
      .authenticated === true
  );

}


/* ==========================================================
 * LOGOUT
 * ======================================================== */

export async function logout() {

  const sessionToken =
    getSessionToken();


  try {

    if (sessionToken) {

      await api.logout(
        sessionToken
      );

    }

  } finally {

    clearSessionToken();
    clearAuthChallenge();
    clearAuthState();

  }

}