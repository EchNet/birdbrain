
export const geoConnector = {

  getCurrentPosition: function() {
    return new Promise((resolve, reject) => {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          position => { console.log(position); resolve(position) },
          error => { console.log(error); reject(error) }
        );
      }
      else {
        reject("Geolocation is not supported by this browser.");
      }
    });
  }
};
