import React, { useContext } from 'react';

const LS_KEY = "BirdStalker";

/**
 * Return a memoized version of the given function.
 */
function memoizedFunction(func) {
  var memoized;
  var result;
  return function() {
    if (!memoized) {
      result = func.apply(this, arguments);
    }
    return result;
  }
}

/**
 * localStorage browser capability flag.
 */
const lsAvailable = memoizedFunction(function() {
  try {
    localStorage.setItem("$test", "$test")
    localStorage.removeItem("$test")
    return true;
  }
  catch (e) {
    return false;
  }
})

/**
 * Load JSON from localStorage.  Return false (exactly) if localStorage is unavailable.
 */
function lsLoadJson(key, dflt) {
  return lsAvailable() && (JSON.parse(localStorage.getItem(key)) || dflt);
}

/**
 * Save JSON to localStorage.  Return false (exactly) if localStorage is unavailable.
 */
function lsSaveJson(key, value) {
  value = JSON.stringify(value);
  return lsAvailable() && localStorage.setItem(key, value);
}

export const storageConnector = {

  persistState: function(state) {
    lsSaveJson(LS_KEY, Object.assign({}, state, { ts: new Date().getTime() }));
  },

  restoreState: function() {
    return new Promise(resolve => {
      var savedState = lsLoadJson(LS_KEY);
      resolve(savedState);
    });
  },
};
