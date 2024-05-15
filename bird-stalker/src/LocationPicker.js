import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import AppContext from './AppContext';
import { geoConnector } from './GeoConnector';
import { googleMapsConnector } from './GoogleMapsConnector';

//
// Format a location dictionary.
//
function showLocation(location) {
  if (location.description) {
    return location.description;
  }
  return `latitude ${location.latitude}, longitude ${location.longitude}`;
}

function describePosition({ latitude, longitude }) {
  return new Promise((resolve, reject) => {
    googleMapsConnector.reverseGeocode(latitude, longitude)
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

function getCurrentLocation({ doReverseGeocode }) {
  return new Promise((resolve, reject) => {
    geoConnector.getCurrentPosition()
      .then(position => {
        const { latitude, longitude } = position.coords;
        if (latitude != null && longitude != null) {
          var description = null;
          if (doReverseGeocode) {
            describePosition({ latitude, longitude })
              .then((desc) => { description = desc; })
              .catch((error) => {
                console.error('geocoding error:', error);
              })
              .finally(() => {
                resolve({ latitude, longitude, description });
              })
          }
          else {
            resolve({ latitude, longitude });
          }
        }
        else {
          reject("Unknown location.");
        }
      })
      .catch(error => reject(error.message));
    }
  );
}

function GeoLocationPicker({ onAccept, onCancel, onError }) {
  const [ waiting, setWaiting ] = useState(false);
  const [ foundLocation, setFoundLocation ] = useState(null);

  useEffect(() => {
    if (!foundLocation) {
      setWaiting(true);
      getCurrentLocation({ doReverseGeocode: true })
        .then(setFoundLocation)
        .catch(errMsg => onError(errMsg))
        .finally(() => setWaiting(false));
    }
  }, [ foundLocation ]);

  return (
    <div className="text-center">
      { waiting ? <CircularProgress/> : null }
      { foundLocation ? (
        <>
          <p style={{ fontSize: "1.1em" }}>Found you at {showLocation(foundLocation)}</p>
          <div className="flow-menu">
            <Button variant="outlined" onClick={() => onAccept(foundLocation)}>Looks good to me.</Button>
            <Button variant="outlined" color="secondary" onClick={onCancel}>Try a different way.</Button>
          </div>
        </>
      ) : null }
    </div>
  );
}

function MapLocationPicker({ onAccept, onCancel, onError }) {

  useEffect(() => {
    onError("Not implemented");
  }, []);

  return null;
}

function AddressLocationPicker({ onAccept, onCancel, onError }) {

  useEffect(() => {
    onError("Not implemented");
  }, []);

  return null;
}

function RegionLocationPicker({ onAccept, onCancel, onError }) {

  useEffect(() => {
    onError("Not implemented");
  }, []);

  return null;
}

function LocationPicker({ onCancel }) {
  const { location, setLocation } = useContext(AppContext);
  const navigate = useNavigate();

  const [ Picker, setPicker ] = useState(null);
  const [ errorMsg, setErrorMsg ] = useState(null);

  function onAccept(newLocation) {
    setLocation(newLocation);
    navigate("/");
  }

  function onError(errorMsg) {
    setErrorMsg(errorMsg);
  }

  function onStartOver() {
    setPicker(null);
    setErrorMsg(null);
  }

  return (
    <>
      <h2>Where do you want to go bird stalking?</h2>
      { !Picker && (
          <>
            <div className="flow-menu">
              <Button variant="outlined"
                onClick={() => setPicker(() => GeoLocationPicker)}>Use my current location</Button>
              <Button variant="outlined"
                onClick={() => setPicker(() => MapLocationPicker)}>Point out the location on a map</Button>
              <Button variant="outlined"
                onClick={() => setPicker(() => AddressLocationPicker)}>Type in an address</Button>
              <Button variant="outlined"
                onClick={() => setPicker(() => RegionLocationPicker)}>Pick a region from a list</Button>
            </div>
            { location ? (
              <div className="flow-menu" style={{ marginTop: "1em" }}>
                <Button variant="outlined" color="secondary"
                  onClick={() => onCancel()}>Never mind, I'll stay put</Button>
              </div>
            ) : null}
          </>
      ) }
      { Picker && !errorMsg ? (
        <Picker onAccept={onAccept} onCancel={onStartOver} onError={onError}/>
      ) : null }
      { errorMsg ? (
        <>
          <p className="text-center error">{errorMsg}</p>
          <div className="text-center flow-menu">
            <Button variant="outlined" onClick={onStartOver}>Try a different way.</Button>
          </div>
        </>
      ) : null }
    </>
  );
}

function LocationSummary({ onUpdate }) {
  const { location } = useContext(AppContext);
  return (
    <>
      <p className="text-center" style={{ fontSize: "2em" }}>{showLocation(location)}</p>
      <div className="flow-menu text-center">
        <Button variant="outlined" onClick={onUpdate}>Start stalking somewhere else</Button>
      </div>
    </>
  )
}

function LocationView() {
  const { location } = useContext(AppContext);
  const [ picking, setPicking ] = useState(!location);

  return (
    <section>
      { picking
          ? <LocationPicker onCancel={() => setPicking(false)}/>
          : <LocationSummary onUpdate = {() => setPicking(true)}/> }
    </section>
  )
}

export default LocationView;
