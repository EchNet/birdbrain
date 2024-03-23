
function EbirdApiConnector(config) {

  var { apiKey, maxDistanceMiles } = config;

  const BASE_URL = "https://api.ebird.org/v2/";

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

  function getRecentNearbyObservations(latitude, longitude) {
    const PATH = "data/obs/geo/recent";
    const url = `${BASE_URL}${PATH}?lat=${latitude}&lng=${longitude}`;
    return apiPromise(url);
  }

  return { 
    getRecentNearbyObservations,
  }
}

export default EbirdApiConnector;
