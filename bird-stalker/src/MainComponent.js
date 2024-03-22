import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import AppContext from './AppContext';
import WelcomeView from './WelcomeView';

function MainComponent() {
  const { state, setState } = useContext(AppContext);

  if (!state.initialized) {
    return null;
  }

  if (state.apiKey === null) {
    return <WelcomeView />
  }

  return (
    <div>
      <header className="App-header">
        <div className="App-header-title">Bird Stalker</div>
        <div className="App-header--subtext">v1.0</div>
      </header>
      <section className="App-main">
        <div>Main Component</div>
        <div>Initialized: { state.initialized }</div>
        <div>API Key: { state.apiKey }</div>
        <div>Location: { state.location }</div>
        <div><Button variant="contained">Hello World!</Button></div>
      </section>
    </div>
  );
}

export default MainComponent;
