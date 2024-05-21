import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import CircularProgress from '@mui/material/CircularProgress';
import AppContext from './AppContext';
import { geoConnector } from './GeoConnector';
import GoogleMapsContext from './GoogleMapsContext';
import { googleApiConnector } from './GoogleApiConnector';

const METERS_IN_A_MILE = 1609.34;

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
    let { lat: latitude, lng: longitude } = coords;
    if (latitude != null && longitude != null) {
      if (typeof latitude === "function") {
        latitude = latitude();
        longitude = longitude();
      }
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


function AutocompleteTextInput({ google, onChange }) {
  const [ autocomplete, setAutocomplete ] = useState();
  const textField = useRef();

  useEffect(() => {
    if (!autocomplete && google && textField.current) {

      const ac = new google.maps.places.Autocomplete(textField.current, {
        fields: ["address_components", "formatted_address", "geometry"]
      });
      setAutocomplete(ac);

      const acListener = google.maps.event.addListener(ac, "place_changed", () => {
        pickAutocompletedPlace(ac.getPlace());
      });
    }
  }, [autocomplete, google, textField]);

  function pickAutocompletedPlace(place) {
    const { formatted_address: description, geometry: { location: latLng } } = place;
    onChange(Object.assign(locationGoogleToUs(latLng), { description }));
  }
  return (
    <input ref={textField} placeholder="Start typing a place name..."/>
  )
}


function LocationPicker({ onAccept, onRevert }) {
  const { location, setLocation, radiusMiles, setRadiusMiles } = useContext(AppContext);
  const { loadGoogle } = useContext(GoogleMapsContext);
  const navigate = useNavigate();
 
  const [ picking, setPicking ] = useState(!location);
  const [ initialized, setInitialized ] = useState(!picking);
  const [ google, setGoogle ] = useState();
  const [ googleImported, setGoogleImported ] = useState(false);
  const [ chosenLocation, setChosenLocation ] = useState(location);
  const [ ranGeo, setRanGeo ] = useState(location);
  const [ mapInstance, setMapInstance ] = useState();
  const [ circleInstance, setCircleInstance ] = useState();
  const [ lastPannedLocation, setLastPannedLocation ] = useState(location);
  const mapContainer = useRef();

  useEffect(() => {
    // When initialization is complete, hide the spinner.
    if (!initialized && chosenLocation && mapInstance && circleInstance) {
      setInitialized(true);
    }
  }, [initialized, mapInstance, circleInstance, chosenLocation]);

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
    // Construct the circle.
    if (!circleInstance && mapInstance && google) {
      setCircleInstance(new google.maps.Circle({
        map: mapInstance,
        strokeColor: "#ff0000",
        strokeOpacity: 0.66,
        strokeWeight: 0.5,
        fillColor: "#ff0000",
        fillOpacity: 0.125,
        radius: radiusMiles * METERS_IN_A_MILE,
        visible: false
      }));
    }
  }, [circleInstance, mapInstance, google]);

  useEffect(() => {
    // Pan map to chosen location.
    if (mapInstance && chosenLocation && !locationsEqual(chosenLocation, lastPannedLocation)) {
      const googleLocation = locationUsToGoogle(chosenLocation);
      mapInstance.panTo(googleLocation);
      setLastPannedLocation(chosenLocation);
    }
  }, [mapInstance, chosenLocation, lastPannedLocation]); 

  useEffect(() => {
    // Place circle at chosen location.
    if (circleInstance && chosenLocation) {
      const googleLocation = locationUsToGoogle(chosenLocation);
      if (googleLocation) {
        circleInstance.setCenter(googleLocation);
        circleInstance.setVisible(true);
        mapInstance.fitBounds(circleInstance.getBounds());
      }
      else {
        circleInstance.setVisible(false);
      }
    }
  }, [circleInstance, chosenLocation]); 

  function onAccept() {
    setLocation(chosenLocation);
    navigate("/");
  }

  function onRevert() {
    setPicking(false);
    setChosenLocation(location);
  }

  function onRadiusSliderChange(e) {
    const { target: { value } } = e;
    setRadiusMiles(value);
    if (circleInstance) {
      circleInstance.setRadius(value * METERS_IN_A_MILE);
      if (chosenLocation) {
        const googleLocation = locationUsToGoogle(chosenLocation);
        circleInstance.setCenter(googleLocation);
        mapInstance.fitBounds(circleInstance.getBounds());
      }
    }
  }

  function onPlaceChange(newLocation) {
    setChosenLocation(newLocation);
  }

  return (
    <section>
      { picking ? (
        <h2>Pick a {location ? "new " : ""}area to stalk in</h2>
      ) : (
        <h2>
          You're stalking {inOrAt(location)} {formatLocation(location)}
          {" "}<Button onClick={() => setPicking(true)}>Change</Button>
        </h2>
      )}
      { picking ? (
        <div className="placeInput">
          <AutocompleteTextInput google={google} onChange={onPlaceChange}/>
        </div>
      ) : null }
      <div ref={mapContainer} style={{ height: 400 }}></div>
      <div>{ initialized ? null : <CircularProgress/> }</div>
      { picking ? (
        <div className="">
          <Slider value={radiusMiles} aria-label="Radius in miles"
              valueLabelDisplay="auto" shiftStep={5} step={1} min={1} max={110} 
              onChange={onRadiusSliderChange} />
          <div className="flow-menu text-center">
            { chosenLocation && chosenLocation.latitude != null ? (
              <Button variant="outlined" onClick={onAccept}>Stalk here.</Button>
            ) : null }
            { location ? (
              <Button variant="outlined" color="secondary" onClick={onRevert}>Go back to the previous area</Button>
            ) : null }
          </div>
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

export default LocationPicker;
