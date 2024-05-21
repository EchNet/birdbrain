import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import AppContext from './AppContext';


const API_KEYGEN_URL = "https://ebird.org/api/keygen";


function WelcomeView() {
  return (
    <>
      <h1>Welcome!</h1>
      <p>
        Use <span className="logo">Bird Stalker</span> to track down bird species in your area,
        based on sightings reported to <span className="logo"><a href="https://ebird.org"><b>eBird</b></a></span>.
      </p>
      <p>
        To get started, you must have an{" "}
        <span className="logo"><a href="https://ebird.org"><b>eBird</b></a></span> account,
        and you must provide Bird Stalker with your eBird API key.
      </p>
      <p className="text-center">
        <a href={API_KEYGEN_URL} target="_new">
          <Button type="button" variant="outlined">
            CLICK HERE
          </Button>
        </a>
        {" "}to log in to <span className="logo">eBird</span> and get your API key.
      </p>
    </>
  )
}


function validApiKey(input) {
  const API_KEY_REGEXP = /^[0-9a-z]{12}$/;
  return !!input.match(API_KEY_REGEXP);
}


function ApiKeyView() {
  const { apiKey, setApiKey } = useContext(AppContext);
  const navigate = useNavigate();

  const [ inputApiKey, setInputApiKey ] = useState(apiKey);
  const [ inputApiKeyIsValid, setInputApiKeyIsValid ] = useState(apiKey && validApiKey(apiKey));
  const [ inputApiKeySubmitted, setInputApiKeySubmitted ] = useState(false);

  function onInputApiKeyChange(event) {
    const input = event.target.value;
    const inputIsValid = validApiKey(input);
    setInputApiKey(input)
    setInputApiKeyIsValid(inputIsValid);
    setInputApiKeySubmitted(false);
  }

  function onFormSubmit(event) {
    event.preventDefault();
    if (inputApiKey.length) {
      setInputApiKeySubmitted(true);
      if (inputApiKeyIsValid) {
        setApiKey(inputApiKey);
        navigate("/");
      }
    }
  }

  const showWelcome = !apiKey;

  return (
    <section>
      { showWelcome ? <WelcomeView/> : null }
      <form className="text-center" onSubmit={onFormSubmit}>
        <FormControl>
          <TextField 
              defaultValue={apiKey}
              label="Enter your API key here"
              error={inputApiKeySubmitted && !inputApiKeyIsValid}
              helperText="The eBird API key consists of 12 alphanumeric characters."
              placeholder="example: 123456abcdef"
              onChange={onInputApiKeyChange}
              inputProps={{style: {fontSize: 22}}}
              InputLabelProps={{style: {fontSize: 19, background: "white", padding: 1}}}
              ></TextField>
          <Button type="submit" variant="contained" disabled={!inputApiKey}>Submit</Button>
        </FormControl>
      </form>
    </section>
  );
}

export default ApiKeyView;
