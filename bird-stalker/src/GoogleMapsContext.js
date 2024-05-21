import React, { createContext, useEffect, useState } from 'react';

const GoogleMapsContext = createContext();

const API_HOST = "https://maps.googleapis.com";
const API_PATH = "/maps/api/js";
const GOOGLE_API_KEY = "uAIzaSyDAlOs1QPSV5FPEE1jY".substring(1) + "-IEcm7TYmQ2ucjU";

var promise;

function getGoogleScriptSrc(googleCallbackName) {
  const queryPairs = [
    [ "key", GOOGLE_API_KEY ],
    [ "loading", "async" ],
    [ "v", "3.26" ],
    [ "language", "en" ],
    [ "libraries", [ "places", "geometry" ].join(",") ],
    [ "callback", googleCallbackName ]
  ];
  const queryParams = queryPairs.map((pair) => `${pair[0]}=${encodeURIComponent(pair[1])}`);
  const queryStr = queryParams.join("&");
  return `${API_HOST}/${API_PATH}?${queryStr}`;
}

export const GoogleMapsProvider = ({ children }) => {

  function loadGoogle() {
    if (!promise) {
      promise = new Promise((resolve, reject) => {
        if (window.google) {
          resolve(window.google);
        }
        else {
          const googleCallbackName = "gbird" + Math.floor(Math.random() * 999999);
          const googleCallback = () => {
            resolve(window.google);
          };
          window[googleCallbackName] = googleCallback;
          const scriptEle = document.createElement("script");
          scriptEle.src = getGoogleScriptSrc(googleCallbackName);
          document.head.appendChild(scriptEle);
        }
      });
    }
    return promise;
  }

  return (
    <GoogleMapsContext.Provider value={{ loadGoogle }}>
      {children}
    </GoogleMapsContext.Provider>
  )
};

export default GoogleMapsContext;
