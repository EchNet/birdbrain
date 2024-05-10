import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import AppContext from './AppContext';
import EbirdApiConnector from './EbirdApiConnector';

function BirdSpeciesView(props) {
  const { speciesCode } = useParams();
  const { apiKey, location, maxDistanceMiles } = useContext(AppContext);
  const [ recentObservations, setRecentObservations ] = useState(null);
  const [ historicObservations, setHistoricObservations ] = useState(null);
  const [ waiting, setWaiting ] = useState(true);
  const [ comName, setComName ] = useState("");

  function processRecentNearbyObservations(observations) {
    var comName = null;
    var recentObservations = observations;
    for (var i = 0; i < observations.length; ++i) {
      const obs = observations[i];
      comName = obs.comName;
    }
    setRecentObservations(recentObservations);
    setComName(comName);
  }

  useEffect(() => {
    const ebirdApiConnector = EbirdApiConnector({ apiKey, maxDistanceMiles });
    const { latitude, longitude } = location;
    ebirdApiConnector.getRecentNearbyObservationsOfSpecies(speciesCode, latitude, longitude)
      .then(processRecentNearbyObservations)
      .catch((error) => console.log(error))
      .finally(() => setWaiting(false));
  }, []);


  function ObservationView(props) {
    const { data: { locName, obsDt, howMany } } = props;
    return (
      <p>
        {obsDt} at {locName} ({howMany})
      </p>
    )
  }

  return (
    <div className="main">
      <h1>Stalking the {comName}...</h1>
      <h2>Recent observations near your location...</h2>
      <div>
        { !waiting && recentObservations.map((obs) => <ObservationView data={obs} />) }
      </div>
      <h3>More about the {comName} at <a href={`https://ebird.org/species/${speciesCode}`} target={speciesCode}>eBird.org</a>...</h3>
    </div>
  );
}

export default BirdSpeciesView;
