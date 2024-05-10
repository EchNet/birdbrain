import React, { useContext, useState } from 'react';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import AppContext from './AppContext';

function WelcomeView() {
  const { setApiKey } = useContext(AppContext);

  const API_KEYGEN_URL = "https://ebird.org/api/keygen";

  const API_KEY_REGEXP = /^[0-9a-z]{12}$/;

  const [ inputApiKey, setInputApiKey ] = useState(null);
  const [ inputApiKeyIsValid, setInputApiKeyIsValid ] = useState(false);
  const [ inputApiKeySubmitted, setInputApiKeySubmitted ] = useState(false);

  const onInputApiKeyChange = (event) => {
    const input = event.target.value;
    const inputIsValid = !!input.match(API_KEY_REGEXP);
    setInputApiKey(input)
    setInputApiKeyIsValid(inputIsValid);
    setInputApiKeySubmitted(false);
  };

  const onFormSubmit = (event) => {
    event.preventDefault();
    if (inputApiKey.length) {
      setInputApiKeySubmitted(true);
      if (inputApiKeyIsValid) {
        setApiKey(inputApiKey);
      }
    }
  };

  return (
    <div className="welcome">
      <h1>Welcome to Bird Stalker</h1>
      <h3>
        Track down bird species in your area, based on sightings reported 
        to <a href="https://ebird.org"><b>eBird.org</b></a>.
      </h3>
      <form onSubmit={onFormSubmit}>
        <p>
          To use Bird Stalker, you must have an <a href="https://ebird.org"><b>eBird.org</b></a> account,
          and you must provide Bird Stalker with an eBird API key. 
        </p>
        <p>
          <a href={API_KEYGEN_URL} target="_new">Click here to get your API key.</a>
        </p>
        <FormControl>
          <TextField 
              label="Enter your API key here"
              error={inputApiKeySubmitted && !inputApiKeyIsValid}
              helperText="The eBird API key consists of 12 alphanumeric characters."
              placeholder="example: 123456abcdef"
              onChange={onInputApiKeyChange}
              ></TextField>
          <Button type="submit" variant="contained" disabled={!inputApiKey}>Submit</Button>
        </FormControl>
      </form>
    </div>
  );
}

export default WelcomeView;
