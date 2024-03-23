const LS_KEY = "BirdStalker";

/**
 * Load JSON from localStorage.
 */
function loadJson(key) {
  return JSON.parse(localStorage.getItem(key));
}

/**
 * Save JSON to localStorage.
 */
function saveJson(key, value) {
  value = JSON.stringify(value);
  return localStorage.setItem(key, value);
}

export const storageConnector = {

  saveState: function(state) {
    saveJson(LS_KEY, Object.assign({}, state, { ts: new Date().getTime() }));
  },

  restoreState: function() {
    return new Promise(resolve => {
      var savedState = loadJson(LS_KEY);
      resolve(savedState);
    });
  },
};
