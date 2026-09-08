const state = {

  auth: {
    authenticated: false,
    player: null,
    account: null
  },

  navigation: {
    currentPath: "/"
  },

  app: {
    initialized: false
  }

};


export function getState() {
  return state;
}


export function setAuthState(authState) {

  state.auth = {
    ...state.auth,
    ...authState
  };

}


export function clearAuthState() {

  state.auth = {
    authenticated: false,
    player: null,
    account: null
  };

}


export function setCurrentPath(path) {

  state.navigation.currentPath = path;

}
