import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import AppContext from './AppContext';
import EbirdApiContext from './EbirdApiConnector';

function BirdSpeciesView() {
  const { speciesCode } = useParams();
  const { apiKey, location } = useContext(AppContext);
  const [ recentObservations, setRecentObservations ] = useState(null);
  const [ historicObservations, setHistoricObservations ] = useState(null);
  const [ waiting, setWaiting ] = useState(true);
  const [ comName, setComName ] = useState("");
  const { ready: apiReady, getObservations } = useContext(EbirdApiContext);

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

  async function fillPlate() {
    try {
      const obs = await getObservations({ speciesCode });
      processRecentNearbyObservations(obs);
    }
    catch (e) {
      console.error(e);
    }
    finally {
      setWaiting(false);
    }
  }

  useEffect(() => {
    fillPlate();
  }, []);

  function ObservationView({ data }) {
    const { locName, obsDt, howMany } = data;
    return (
      <p>
        {obsDt} at {locName} ({howMany})
      </p>
    )
  }

  return (
    <div className="main">
      <h1>Stalking the {comName}...</h1>
      <h2>Recent observations in your area...</h2>
      <div>
        { !waiting && recentObservations.map((obs) => <ObservationView data={obs} />) }
      </div>
      <h3>More about the {comName} at <a href={`https://ebird.org/species/${speciesCode}`} target={speciesCode}>eBird.org</a>...</h3>
    </div>
  );
}

export default BirdSpeciesView;
