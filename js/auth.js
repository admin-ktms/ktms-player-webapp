import {
  api
} from "./api.js";

import {
  setState
} from "./state.js";

import {
  CONFIG
} from "./config.js";


export async function restoreSession() {

  try {

    const result =
      await api.validateSession();


    if (!result) {

      return false;

    }


    setState({
      session: result,
      player:
        result.player ||
        null
    });


    return true;

  } catch (error) {

    setState({
      session: null,
      player: null
    });


    return false;

  }

}


export async function requestLoginCode(
  accountId
) {

  return api.requestLoginCode(
    accountId
  );

}


export async function verifyLoginCode(
  challengeId,
  otp
) {

  const result =
    await api.verifyOtp(
      challengeId,
      otp
    );


  setState({
    session:
      result.session ||
      result,

    player:
      result.player ||
      null
  });


  return result;

}


export async function logout() {

  try {

    await api.logout();

  } finally {

    setState({
      session: null,
      player: null
    });

    sessionStorage.removeItem(
      CONFIG.SESSION_STORAGE_KEY
    );

  }

}
