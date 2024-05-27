import React, { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import AppContext from './AppContext';
import Loader from './Loader';
import GoogleMapsContext from './GoogleMapsContext';
import { geoConnector } from './GeoConnector';
import { googleApiConnector } from './GoogleApiConnector';

const DEFAULT_RADIUS_MILES = 10;
const METERS_IN_A_MILE = 1609.34;

//
// Format a location dictionary.
//
function formatLocation(location) {
  const parts = [];

  if (location.latitude == null && location.description == null) {
    parts.push("some unknown area");
  }
  else {
   parts.push(location.radiusMiles < 3 ? "near" : `within ${location.radiusMiles} miles of`);

    if (location.description) {
      parts.push(location.description);
    }
    else if (location.latitude != null) {
      parts.push(`latitude ${location.latitude},`);
      parts.push(`longitude ${location.longitude}`);
    }
  }

  return parts.join(" ");
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

function describePosition({ latitude, longitude }) {
  return new Promise((resolve, reject) => {
    googleApiConnector.reverseGeocode(latitude, longitude)
      .then((geocoding) => {
        if (geocoding) {
          resolve(geocoding);
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

function takeDescriptionFromGeocoding(geocoding, location) {
  location.description = geocoding.name || geocoding.formatted_address;

  const acomps = geocoding.address_components;
  if (acomps?.length) {
    const comps = {};
    for (var i = 0; i < acomps.length; ++i) {
      comps[acomps[i].types[0]] = acomps[i];
    }
    [ ["locality", "around"],
      ["administrative_area_level_2", "in"],
      ["administrative_area_level_3"] ].forEach((ele) => {
      const [ type, preposition ] = ele;
      if (comps[type]) {
        if (!location.description) location.description = comps[type].long_name;
        if (!location.preposition) location.preposition = "around";
      }
    });
  }
}

function addDescriptionToLocation(location) {
  return new Promise((resolve, reject) => {
    describePosition(location)
      .then((geocoding) => takeDescriptionFromGeocoding(geocoding, location))
      .finally(() => resolve(location));
  });
}


function AutocompleteTextInput({ google, onChange }) {
  const [ autocomplete, setAutocomplete ] = useState();
  const textField = useRef();

  useEffect(() => {
    if (!autocomplete && google && textField.current) {

      const ac = new google.maps.places.Autocomplete(textField.current, {});
      setAutocomplete(ac);

      google.maps.event.addListener(ac, "place_changed", () => {
        pickPlace(ac.getPlace());
      });
    }
  }, [autocomplete, google, textField]);

  function pickPlace(place) {
    const { geometry: { location: latLng } } = place;
    const location = locationGoogleToUs(latLng);
    takeDescriptionFromGeocoding(place, location);
    onChange(location);
  }

  return (
    <input ref={textField} placeholder="Start typing a place name..."/>
  )
}


function LocationPicker({ onAccept, onRevert }) {
  const { location, setLocation } = useContext(AppContext);
  const { loadGoogle } = useContext(GoogleMapsContext);
  const navigate = useNavigate();
 
  const [ radiusMiles, setRadiusMiles ] = useState(location.radiusMiles || DEFAULT_RADIUS_MILES);
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
      getCurrentLocation().then((location) => {
        addDescriptionToLocation(location).then(setChosenLocation);
      });
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
        controlSize: 24
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
        circleInstance.setRadius(radiusMiles * METERS_IN_A_MILE);
        circleInstance.setVisible(true);
        mapInstance.fitBounds(circleInstance.getBounds());
      }
      else {
        circleInstance.setVisible(false);
      }
    }
  }, [circleInstance, chosenLocation, radiusMiles]); 

  function onAccept() {
    setLocation(chosenLocation);
    navigate("/");
  }

  function onRevert() {
    setPicking(false);
    setChosenLocation(location);
  }

  function onPlaceChange(newLocation) {
    newLocation.radiusMiles = radiusMiles;
    setChosenLocation(newLocation);
  }

  function renderLocationPickingHeader() {
    return (
      <>
        <h2>Pick a{location ? " new" : "n"} area to stalk in</h2>
        { chosenLocation ? (
          <p><b>Showing:</b> {formatLocation(chosenLocation)}</p>
        ) : null }
        <div className="placeInput">
          <AutocompleteTextInput google={google} onChange={onPlaceChange}/>
        </div>
      </>
    )
  }

  function renderLocationAtRestHeader() {
    return (
      <h2>
        You're stalking {formatLocation(location)}
        {" "}<Button onClick={() => setPicking(true)}>Change</Button>
      </h2>
    )
  }

  function renderLocationPickingFooter() {

    function onRadiusSliderChange(event, value) {
      setRadiusMiles(value);
    }

    function getAriaValueText() {
      return getValueLabel(radiusMiles);
    }

    function getValueLabel(radiusMiles) {
      return `${radiusMiles} mile${radiusMiles !== 1 ? "s" : ""}`;
    }

    return (
      <div className="">
        <Slider value={radiusMiles} aria-label="Radius in miles" getAriaValueText={getAriaValueText}
            valueLabelDisplay="auto" valueLabelFormat={getValueLabel} step={1} min={1} max={110} 
            onChange={onRadiusSliderChange} />
        <div className="flow-menu text-center">
          { chosenLocation && chosenLocation.latitude != null ? (
            <Button variant="outlined" onClick={onAccept}>Stalk here</Button>
          ) : null }
          { location ? (
            <Button variant="outlined" color="secondary" onClick={onRevert}>Cancel</Button>
          ) : null }
        </div>
      </div>
    )
  }

  function renderLocationAtRestFooter() {
    return location ? (
      <div className="flow-menu text-center">
        <Button variant="outlined" color="secondary" onClick={() => navigate("/")}>Good. Let's stalk</Button>
      </div>
    ) : null;
  }

  return (
    <section>
      <Loader initialized={initialized}>
        <>
          { picking ? renderLocationPickingHeader() : renderLocationAtRestHeader() }

          <div ref={mapContainer} style={mapInstance ? { height: 400 } : {}}></div>

          { picking ? renderLocationPickingFooter() : renderLocationAtRestFooter() }
        </>
      </Loader>
    </section>
  )
}

export default LocationPicker;
