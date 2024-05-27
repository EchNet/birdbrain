import React, { createContext, useContext } from 'react';
import AppContext from './AppContext';

const EbirdApiContext = createContext();

const BASE_URL = "https://api.ebird.org/v2/";

const KILOMETERS_PER_MILE = 1.60934;


export const EbirdApiProvider = ({ children }) => {

  const { apiKey, location } = useContext(AppContext);

  const { radiusMiles } = location || {};

  const ready = (apiKey != null) && (location.latitude != null || location.regionCode != null);

  function queryString(queryParams=[]) {
    return queryParams.map((pair) => pair.join("=")).join("&");
  }

  function apiUrl(path, queryParams) {
    return `${BASE_URL}${path}?${queryString(queryParams)}`;
  }

  function apiPromise(url) {
    return new Promise((resolve, reject) => {

      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.setRequestHeader("X-eBirdApiToken", apiKey);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            try {
              const data = JSON.parse(xhr.response) || [];
              resolve(data);
            }
            catch (e) {
              reject(e.toString());
            }
          }
          else {
            console.log(xhr.response);
            reject(xhr.response.toString());
          }
        }
      };
      xhr.send();
    });
  }

  function getObservations(params = {}) {
    //
    // Context:
    //   regionCode = include observations within ebird region code only
    //   latitude, longitude = include observations close to given coordinates only
    //
    const { regionCode, latitude, longitude, radiusMiles } = location;

    //
    // Params:
    //   speciesCode = include observations of ebird species code only
    //   notable = (bool) include notable observations only
    //   nearest = (bool) sort by nearest observation to coordinates
    //
    const { nearest, notable, speciesCode } = params;

    let path = "data/obs";

    let queryParams = [
      [ "back", 6 ],
      [ "detail", "full" ]
    ];

    if (regionCode) {
      path += `/${regionCode}`;
    }
    else {
      if (nearest && speciesCode) {
        path += "/nearest";
      }
      path += "/geo";

      const radiusKilometers = (radiusMiles || 10) * KILOMETERS_PER_MILE;
      queryParams = queryParams.concat([
        [ "lat", latitude ],
        [ "lng", longitude ],
        [ "dist", radiusKilometers ]
      ]);
    }

    path += "/recent";

    if (speciesCode) {
      path += `/${speciesCode}`;
    }
    else if (notable) {
      path += "/notable";
    }

    return apiPromise(apiUrl(path, queryParams));
  }

  return (
    <EbirdApiContext.Provider value={{
        apiKey,
        getObservations,
        ready
    }}>
      {children}
    </EbirdApiContext.Provider>
  );
}

export default EbirdApiContext;
