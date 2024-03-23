import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import AppContext from './AppContext';
import EbirdApiConnector from './EbirdApiConnector';


function BirdList() {
  const { apiKey, location, maxDistanceMiles } = useContext(AppContext);
  const navigate = useNavigate();

  const [ waiting, setWaiting ] = useState(true);
  const [ birds, setBirds ] = useState([]);

  useEffect(() => {
    const ebirdApiConnector = EbirdApiConnector({ apiKey, maxDistanceMiles });
    const { latitude, longitude } = location;
    ebirdApiConnector.getRecentNearbyObservations(latitude, longitude)
      .then((results) => setBirds(results))
      .catch((error) => console.log(error))
      .finally(() => setWaiting(false));
  }, []);

  function BirdListItem(props) {
    const { data } = props;
    return (
      <div className="bird-list-item">
        <input type="checkbox" checked="checked" /> { data.comName }
      </div>
    );
  }

  return (
    <div className="main">
      <h3>
        The local birdbrains...
      </h3>
      <div className="stack-menu">
        { waiting && <CircularProgress/> }
        { birds.map((b) => <BirdListItem data={b}/>) }
        { !waiting && !birds.length && <p>No birds here?  That's strange.</p> }
        <Button variant="outlined" onClick={() => navigate("/")}>I'm done here</Button>
      </div>
      <div>
        <img src="/img/birdstalker2.png" width="100%"/>
      </div>
    </div>
  );
}

export default BirdList;
