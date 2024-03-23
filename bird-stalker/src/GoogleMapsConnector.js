const GOOGLE_API_KEY = "AIzaSyDAlOs1QPSV5" + "FPEE1jY-IEcm7TYmQ2ucjU"

function findAddressByType(results, typeName) {
  for (var i = 0; i < results.length; ++i) {
    if (results[i].types.find(t => t === typeName)) {
      return results[i];
    }
  }
}


function findBestResult(geocoding) {
  return findAddressByType(geocoding.results, "premise") ||
         findAddressByType(geocoding.results, "street_address") ||
         findAddressByType(geocoding.results, "postal_code");
}

export const googleMapsConnector = {

  reverseGeocode: function(latitude, longitude) {
    const url = 
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;

    return new Promise((resolve, reject) => {

      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            try {
              const geocoding = JSON.parse(xhr.response) || [];
              resolve(findBestResult(geocoding));
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
};
