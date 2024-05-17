import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import AppContext from './AppContext';
import { geoConnector } from './GeoConnector';
import GoogleMapsContext from './GoogleMapsContext';
import { googleApiConnector } from './GoogleApiConnector';

//
// Format a location dictionary.
//
function formatLocation(location) {
  if (location.description) {
    return location.description;
  }
  return `latitude ${location.latitude}, longitude ${location.longitude}`;
}

function inOrAt(location) {
  return location.description ? "in" : "at";
}


function locationGoogleToUs(coords) {
  if (coords) {
    const { lat: latitude, lng: longitude } = coords;
    if (latitude != null && longitude != null) {
      return({ latitude, longitude });
    }
  }
}


function locationUsToGoogle(coords) {
  if (coords) {
    const { latitude: lat, longitude: lng } = coords;
    if (lat != null && lng != null) {
      return({ lat, lng });
    }
  }
}

function locationsEqual(l1, l2){
  return l1 != null && l2 != null && l1.latitude === l2.latitude && l1.longitude === l2.longitude;
}


function describePosition({ latitude, longitude }) {
  return new Promise((resolve, reject) => {
    googleApiConnector.reverseGeocode(latitude, longitude)
      .then((geocoding) => {
        if (geocoding) {
          resolve(geocoding.formatted_address);
        }
        else {
          reject("There's nothing there.");
        }
      })
      .catch((error) => {
        reject(error);
      })
    }
  );
}

function getCurrentLocation() {
  return new Promise((resolve, reject) => {
    geoConnector.getCurrentPosition()
      .then(position => {
        const { latitude, longitude } = position.coords;
        if (latitude != null && longitude != null) {
          resolve({ latitude, longitude });
        }
        else {
          reject("Unknown location.");
        }
      })
      .catch(error => reject(error.message));
    }
  );
}

function LocationView({ onAccept, onRevert }) {
  const { location, setLocation } = useContext(AppContext);
  const { loadGoogle } = useContext(GoogleMapsContext);
  const navigate = useNavigate();
 
  const [ picking, setPicking ] = useState(!location);
  const [ initialized, setInitialized ] = useState(!picking);
  const [ google, setGoogle ] = useState();
  const [ googleImported, setGoogleImported ] = useState(false);
  const [ chosenLocation, setChosenLocation ] = useState(location);
  const [ ranGeo, setRanGeo ] = useState(location);
  const [ mapInstance, setMapInstance ] = useState();
  const [ markerInstance, setMarkerInstance ] = useState();
  const [ lastPannedLocation, setLastPannedLocation ] = useState(location);
  const [ autocomplete, setAutocomplete ] = useState();
  const mapContainer = useRef();
  const textField = useRef();

  useEffect(() => {
    // When initialization is complete, hide the spinner.
    if (!initialized && chosenLocation && mapInstance && markerInstance && autocomplete) {
      setInitialized(true);
    }
  }, [initialized, mapInstance, markerInstance, chosenLocation, autocomplete]);

  useEffect(() => {
    // One time only - import Google Maps code.
    if (!google && !googleImported) {
      setGoogleImported(true);
      loadGoogle().then(setGoogle);
    }
  }, [google]);

  useEffect(() => {
    // If there is no location already chosen, obtain one through geodetection.
    if (!chosenLocation && !ranGeo) {
      setRanGeo(true);
      getCurrentLocation().then(setChosenLocation);
    }
  }, [ chosenLocation, ranGeo ]);

  useEffect(() => {
    // Construct the map, once we have its starting position.
    if (!mapInstance && google && chosenLocation && mapContainer.current) {
      setMapInstance(new google.maps.Map(mapContainer.current, {
        center: locationUsToGoogle(chosenLocation), 
        disableDefaultUI: true,
        gestureHandling: "greedy",
        zoomControl: true,
        zoom: 9,
        controlSize: 25
      }));
      setLastPannedLocation(chosenLocation);
    }
  }, [mapInstance, google, chosenLocation, mapContainer]);

  useEffect(() => {
    // Construct the place marker.
    if (!markerInstance && mapInstance && google) {
      setMarkerInstance(new google.maps.Marker({
        map: mapInstance,
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
        visible: false
      }));
    }
  }, [markerInstance, mapInstance, google]);

  useEffect(() => {
    // Pan map to chosen location.
    if (mapInstance && chosenLocation && !locationsEqual(chosenLocation, lastPannedLocation)) {
      mapInstance.panTo(locationUsToGoogle(chosenLocation))
      setLastPannedLocation(chosenLocation);
    }
  }, [mapInstance, chosenLocation, lastPannedLocation]); 

  useEffect(() => {
    // Place marker at chosen location.
    if (markerInstance && chosenLocation) {
      const googleLocation = locationUsToGoogle(chosenLocation);
      if (googleLocation) {
        if (!locationsEqual(chosenLocation, locationGoogleToUs(markerInstance.position))) {
          markerInstance.setPosition(googleLocation);
          markerInstance.setVisible(true);
        }
      }
      else {
        markerInstance.setVisible(false);
      }
    }
  }, [markerInstance, chosenLocation]); 

  useEffect(() => {
    if (!autocomplete && google && textField.current) {

      const ac = new google.maps.places.Autocomplete(textField.current, {
        fields: ["address_components", "formatted_address", "geometry", "place_id"]
        //types: ["street_address", "premise"]
      });
      setAutocomplete(ac);

      const acListener = google.maps.event.addListener(ac, "place_changed", function() {
        var place = ac.getPlace();
        if (place.place_id) {   // getPlace sometimes returns a void place.
          pickAutocompletedPlace(place);
        }
      });

      /***
      return () => {
        google.maps.event.removeListener(acListener);
        google.maps.event.clearInstanceListeners(ac);
      };
      ***/
    }
  }, [autocomplete, google, textField]);

  function pickAutocompletedPlace(place) {
    const { formatted_address: description, geometry: { location: latLng } } = place;
    setChosenLocation(Object.assign(locationGoogleToUs(latLng), { description }));
  }

  function onAccept(newLocation) {
    setLocation(newLocation);
    navigate("/");
  }

  function onRevert() {
    setPicking(false);
    setChosenLocation(location);
  }

  return (
    <section>
      { picking ? (
        <h2>Pick a new location</h2>
      ) : (
        <h2>
          You're stalking {inOrAt(location)} {formatLocation(location)}
          {" "}<Button onClick={() => setPicking(true)}>Change</Button>
        </h2>
      )}
      { picking ? (
        <div className="placeInput">
          <input ref={textField} placeholder="Start typing a place name..."/>
        </div>
      ) : null }
      <div ref={mapContainer} style={{ height: 300 }}></div>
      <div>{ initialized ? null : <CircularProgress/> }</div>
      { picking ? (
        <div className="flow-menu text-center">
          { chosenLocation && chosenLocation.latitude != null ? (
            <Button variant="outlined" onClick={onAccept}>Stalk here.</Button>
          ) : null }
          { location ? (
            <Button variant="outlined" color="secondary" onClick={onRevert}>On second thought...</Button>
          ) : null }
        </div>
      ) : null }
      { !picking && location ? (
        <div className="flow-menu text-center">
          <Button variant="outlined" color="secondary" onClick={() => navigate("/")}>Good. Let's stalk</Button>
        </div>
      ) : null }
    </section>
  )
}

export default LocationView;
