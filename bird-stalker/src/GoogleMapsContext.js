import React, { createContext, useEffect, useState } from 'react';

const GoogleMapsContext = createContext();

var promise;

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
          const GOOGLE_API_KEY =
            "uAIzaSyDAlOs1QPSV5FPEE1jY".substring(1) + "-IEcm7TYmQ2ucjU";
          const googleScriptSrc =
            `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&loading=async&language=en&libraries=places,geometry&callback=${googleCallbackName}`;
          const scriptEle = document.createElement("script");
          scriptEle.src = googleScriptSrc;
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
