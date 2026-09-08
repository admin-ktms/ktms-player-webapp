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
      "A valid session token is required."
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

    const data =
      await api.validateSession(
        sessionToken
      );


    setAuthState({

      authenticated: true,

      player:
        data?.player || null,

      account:
        data?.account || null

    });


    return {
      authenticated: true,
      data
    };


  } catch (error) {

    if (
      error instanceof ApiError
    ) {

      clearSessionToken();
      clearAuthState();

    }

    return {
      authenticated: false,
      error
    };

  }

}


export function isAuthenticated() {

  return getState()
    .auth
    .authenticated === true;

}


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
    clearAuthState();

  }

}
