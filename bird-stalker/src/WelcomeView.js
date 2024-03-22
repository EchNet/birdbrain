import React, { useContext, useCallback, useState } from 'react';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import TextField from '@mui/material/TextField';
import AppContext from './AppContext';

function WelcomeView() {
  const { state, assignState } = useContext(AppContext);

  const API_KEYGEN_URL = "https://ebird.org/api/keygen";

  const API_KEY_REGEXP = /^[0-9a-z]{12}$/;

  const [ apiKey, setApiKey ] = useState(null);
  const [ apiKeyIsValid, setApiKeyIsValid ] = useState(false);
  const [ apiKeySubmitted, setApiKeySubmitted ] = useState(false);

  const validateApiKey = (event) => {
    const input = event.target.value;
    alert(input);
    setApiKeyIsValid(!!input.match(API_KEY_REGEXP));
    setApiKeySubmitted(false);
  };

  const submitApiKey = (event) => {
    if (apiKey.length) {
      setApiKeySubmitted(true);
      if (apiKeyIsValid) {
        assignState({ apiKey });
      }
    }
  };

  return (
    <div className="welcome">
      <div className="welcome-banner">
        <span className="welcome-banner-text">Welcome to Bird Stalker</span>
      </div>
      <div className="welcome-banner">
        <img src="/img/birdstalker.png" width="212"/>
      </div>
      <p className="welcome-text">
        Bird Stalker helps you track down bird species in your area, based on sightings reported 
        to <a href="https://ebird.org"><b>ebird.org</b></a>.
      </p>
      <p className="welcome-text">
        To use Bird Stalker, you must have an <b>eBird.org</b> account, and you must allow Bird
        Stalker to access sightings information by supplying an eBird API key. 
      </p>
      <p className="welcome-text">
        <a href={API_KEYGEN_URL} target="_new">Click here to get your API key.</a>
      </p>
      <FormControl className="welcome-api-key">
        <FormLabel>Enter your API key here</FormLabel>
        <TextField 
            error={apiKeySubmitted && !apiKeyIsValid}
            helperText="The eBird API key consists of 12 alphanumeric characters."
            placeholder="example: 123456abcdef"
            onChange={validateApiKey}
            ></TextField>
        <Button variant="contained" disabled={!apiKey} onClick={submitApiKey}>Submit</Button>
      </FormControl>
    </div>
  );
}

export default WelcomeView;
