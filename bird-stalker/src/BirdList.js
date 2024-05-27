import React, { useContext, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import AppContext from './AppContext';
import EbirdApiContext from './EbirdApiConnector';
import Loader from './Loader';

const FULL_PLATE = 6;


function BirdListItem(props) {
  const { data: { speciesCode, comName } } = props;

  const { excludedSpecies, addExcludedSpecies, removeExcludedSpecies } = useContext(AppContext);

  return (
    <div className="bird-list-item">
      <div className="image-container">
        <img src={`/img/birds/{speciesCode}.png`} width="100%" />
      </div>
      <div className="other-stuff">
        <h4>{ comName }</h4>
        <p>
          <Button>Add to stalk list</Button>
        </p>
        <p>
          <Button>Add to don't-stalk list</Button>
        </p>
        <p>
          <Button>See observations in area</Button>
          <Link component={RouterLink} to={`/bird/${speciesCode}`}>See observations in area</Link>
        </p>
      </div>
    </div>
  )
}


function BirdList() {
  const [ loading, setLoading ] = useState(false);
  const [ loaded, setLoaded ] = useState(false);
  const [ birds, setBirds ] = useState([]);
  const { ready: apiReady, getObservations } = useContext(EbirdApiContext);
  const { speciesIsTargeted, speciesIsExcluded } = useContext(AppContext);

  function takeBirds(existingBirds, additionalObs) {
    const birdSet = {};
    existingBirds.forEach((bird) => birdSet[bird.speciesCode] = 1);
    const newBirds = existingBirds.slice();
    additionalObs.forEach((obs) => {
      if (newBirds.length < FULL_PLATE) {
        const { comName, speciesCode } = obs;
        if (!birdSet[speciesCode] && !speciesIsExcluded(speciesCode)) {
          newBirds.push({ speciesCode, comName });
          birdSet[speciesCode] = 1;
        }
      }
    });
    return newBirds;
  }

  async function fillPlate() {
    const notables = await getObservations({ notable: true });
    let newBirds = takeBirds(birds, notables);
    if (newBirds.length < FULL_PLATE) {
      const recents = await getObservations({ recent: true });
      newBirds = takeBirds(newBirds, recents);
    }
    return newBirds;
  }

  async function refillBirds() {
    setLoading(true);
    try {
      const newBirds = await fillPlate();
      setBirds(newBirds);
    }
    catch (e) {
      console.error(e);
    }
    finally {
      setLoading(false);
      setLoaded(true);
    }
  }

  useEffect(() => {
    if (!loading && birds.length < FULL_PLATE && apiReady) {
      refillBirds();
    }
  });

  return (
    <section>
      <Loader initialized={loaded}>
        { !birds.length && <p>No birds left to stalk here.</p> }
        <ul className="bird-list">
          { birds.map((b) => <BirdListItem key={b.speciesCode} data={b}/>) }
        </ul>
      </Loader>
    </section>
  );
}

export default BirdList;
