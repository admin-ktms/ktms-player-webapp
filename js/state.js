const state = {

  session: null,

  player: null,

  tournaments: [],

  currentTournament: null,

  currentRoute: null,

  loading: false

};


export function getState() {

  return state;

}


export function setState(
  updates
) {

  Object.assign(
    state,
    updates
  );

}


export function clearSession() {

  state.session = null;
  state.player = null;

}


export function isAuthenticated() {

  return Boolean(
    state.session
  );

}
