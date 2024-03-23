import React, { useContext, useEffect, useCallback, useState } from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import AppContext from './AppContext';
import { geoConnector } from './GeoConnector';
import { googleMapsConnector } from './GoogleMapsConnector';

function showLocation(location) {
  if (location.description) {
    return location.description;
  }
  return `latitude ${location.latitude}, longitude ${location.longitude}`;
}

function LocationPicker() {
  const { location, setLocation } = useContext(AppContext);

  const GEO_MODE = "geo"
  const MAP_MODE = "map";
  const ADDRESS_MODE = "address";
  const REGION_MODE = "region"

  const [ pickMode, setPickMode ] = useState(null);
  const [ waiting, setWaiting ] = useState(false);
  const [ chosenLocation, setChosenLocation ] = useState(null);
  const [ errorMsg, setErrorMsg ] = useState(null);

  useEffect(() => {
    if (location == null && pickMode == GEO_MODE) {
      setWaiting(true);
      geoConnector.getCurrentPosition()
        .then(position => {
          if (pickMode == GEO_MODE) {
            const { latitude, longitude } = position.coords;
            if (latitude != null && longitude != null) {
              var description = null;
              googleMapsConnector.reverseGeocode(latitude, longitude)
                .then((geocoding) => {
                  if (geocoding) {
                    description = geocoding.formatted_address;
                  }
                })
                .catch((error) => {
                  console.log('geocode error:', error);
                })
                .finally(() => {
                  setChosenLocation({ latitude, longitude, description });
                });
            }
          }
        })
        .catch(error => {
          if (pickMode == GEO_MODE) {
            setErrorMsg(error.message);
          }
        })
        .finally(() => pickMode == GEO_MODE && setWaiting(false));
    }
  }, [ location, pickMode ]);

  const onClickAccept = () => setLocation(chosenLocation);

  return (
    <div className="main">
      <h2>Where do you want to go bird stalking?</h2>
      <div className="flow-menu">
        { pickMode == null && (
            <>
              <Button variant="outlined" onClick={() => setPickMode(GEO_MODE)}>Use my current location</Button>
              <Button variant="outlined">Point out the location on a map</Button>
              <Button variant="outlined">Type in an address</Button>
              <Button variant="outlined">Pick a region from a list</Button>
            </>
        ) }
        { pickMode != null && waiting && <CircularProgress/> }
        { pickMode != null && !waiting && errorMsg && (
          <>
            <div class="error">{errorMsg}</div>
            <div><Button onClick={() => setPickMode(null)}>Try a different way.</Button></div>
          </>
        ) }
        { pickMode == GEO_MODE && !waiting && !errorMsg && chosenLocation && (
          <>
            <p>Got you at {showLocation(chosenLocation)}</p>
            <div>
              <Button onClick={onClickAccept}>Looks good to me.</Button>
              <Button onClick={() => setPickMode(null)}>Try a different way.</Button>
            </div>
          </>
        ) }
      </div>
      <div className="welcome-media">
        <img src="/img/birdstalker2.png" width="100%"/>
      </div>
    </div>
  );
}

export default LocationPicker;
