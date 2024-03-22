import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import AppContext from './AppContext';
import WelcomeView from './WelcomeView';

function MainComponent() {
  const { initialized, apiKey, location } = useContext(AppContext);

  if (!initialized) {
    return null;
  }

  if (apiKey == null) {
    return <WelcomeView />;
  }

  return (
    <div>
      <header className="App-header">
        <div className="App-header-title">Bird Stalker</div>
        <div className="App-header--subtext">v1.0</div>
      </header>
      <section className="App-main">
        <div>Main Component</div>
        <div>API Key: { apiKey }</div>
        <div>Location: { location }</div>
        <div><Button variant="contained">Hello World!</Button></div>
      </section>
    </div>
  );
}

export default MainComponent;
