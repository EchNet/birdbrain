import React, { useContext, useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import AppContext from './AppContext';
import EbirdApiContext from './EbirdApiConnector';
import Loader from './Loader';

const FULL_PLATE = 8;


function BirdListItem({ bird, remove }) {
  const { speciesCode, comName } = bird;
  const {
    speciesIsTargeted, addSpeciesToTargetedList, addSpeciesToExcludedList, removeSpeciesFromItsList
  } = useContext(AppContext);

  const targeted = speciesIsTargeted(speciesCode);

  function onAddToStalkList() {
    addSpeciesToTargetedList(speciesCode);
  }

  function onAddToNoStalkList() {
    addSpeciesToExcludedList(speciesCode);
    remove(bird);
  }

  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: 15, background: "white", borderRadius: 12, border: "solid 1px #aaa", marginBottom: 10, filter: "drop-shadow(3px 3px 3px #aaa)"}}>
      <div style={{ width: "50%" }}>
        <h4>{ comName }</h4>
        <img src={`/img/birds/{speciesCode}.png`} width="100%" />
        <p>({ speciesCode })</p>
      </div>
      <div style={{ textAlign: "right", width: "40%" }}>
        <p>
          { targeted ? "TARGET" : "" }
        </p>
        <p>
          <Button disabled={targeted} onClick={onAddToStalkList} >Add to stalk list</Button>
        </p>
        <p>
          <Button onClick={onAddToNoStalkList}>Add to no-stalk list</Button>
        </p>
        <p>
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

  async function fillPlate() {
    const birdSet = {};
    birds.forEach((bird) => birdSet[bird.speciesCode] = 1);
    const newBirds = birds.slice();
    const notables = await getObservations({ notable: true });
    const recents = await getObservations({ recent: true });
    const allObs = notables.concat(recents)
    allObs.forEach((obs) => {
      const { comName, speciesCode } = obs;
      if (!birdSet[speciesCode] && speciesIsTargeted(speciesCode)) {
        newBirds.push({ speciesCode, comName });
        birdSet[speciesCode] = 1;
      }
    });
    allObs.forEach((obs) => {
      const { comName, speciesCode } = obs;
      if (newBirds.length < FULL_PLATE && !birdSet[speciesCode] && !speciesIsExcluded(speciesCode)) {
        newBirds.push({ speciesCode, comName });
        birdSet[speciesCode] = 1;
      }
    });

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

  function removeBird(bird) {
    const { speciesCode } = bird;
    const index = birds.findIndex((ele) => ele.speciesCode === speciesCode);
    setBirds(birds.slice(0, index).concat(birds.slice(index + 1)));
  }

  return (
    <section>
      <Loader initialized={loaded}>
        { !birds.length && <p>No birds left to stalk here.</p> }
        <ul className="bird-list">
          { birds.map((b) => <BirdListItem key={b.speciesCode} bird={b} remove={removeBird}/>) }
        </ul>
      </Loader>
    </section>
  );
}

export default BirdList;
