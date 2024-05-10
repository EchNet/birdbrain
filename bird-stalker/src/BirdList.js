import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import CircularProgress from '@mui/material/CircularProgress';
import AppContext from './AppContext';
import EbirdApiConnector from './EbirdApiConnector';

function sortResults(results) {
  results.sort((a, b) => a.comName > b.comName ? 1 : (a.comName < b.comName ? -1 : 0));
  return results;
}

function BirdListItem(props) {
  const { data: { speciesCode, comName } } = props;

  const { excludedSpecies, addExcludedSpecies, removeExcludedSpecies } = useContext(AppContext);
  const [ included, setIncluded ] = useState(!excludedSpecies[speciesCode]);

  const onChangeCheckbox = (event) => {
    const included = event.target.checked;
    setIncluded(included);
    included ? removeExcludedSpecies(speciesCode) : addExcludedSpecies(speciesCode);
  };

  return (
    <tr className="bird-list-item">
      <td style={{ backgroundColor: included ? "white" : "#c8c8c8" }}>
        <a href={`https://ebird.org/species/${speciesCode}`} target={speciesCode}>{ comName }</a>
      </td>
      <td>
        <input type="checkbox" checked={included} onChange={onChangeCheckbox} />
      </td>
      <td>
        { included && (
          <Link component={RouterLink} to={`/bird/${speciesCode}`}>STALK!</Link>
        ) }
      </td>
    </tr>
  );
}


function BirdList() {
  const { apiKey, location, maxDistanceMiles } = useContext(AppContext);
  const navigate = useNavigate();

  const [ waiting, setWaiting ] = useState(true);
  const [ birds, setBirds ] = useState([]);

  useEffect(() => {
    const ebirdApiConnector = EbirdApiConnector({ apiKey, maxDistanceMiles });
    const { latitude, longitude } = location;
    ebirdApiConnector.getRecentNearbyObservations(latitude, longitude)
      .then((results) => setBirds(sortResults(results)))
      .catch((error) => console.log(error))
      .finally(() => setWaiting(false));
  }, []);

  return (
    <div className="main">
      <h3>
        The local birdbrains...
      </h3>
      <div className="stack-menu">
        { waiting && <CircularProgress/> }
        { !waiting && !birds.length && <p>No birds here?  That's strange.</p> }
        <table><tbody>
          { birds.map((b) => <BirdListItem key={b.speciesCode} data={b}/>) }
        </tbody></table>
        <Button variant="outlined" onClick={() => navigate("/")}>I'm done here</Button>
      </div>
    </div>
  );
}

export default BirdList;
