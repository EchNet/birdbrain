import React, { useContext } from 'react';
import AppContext from './AppContext';
import WelcomeView from './WelcomeView';
import LocationPicker from './LocationPicker';

function MainComponent() {
  const { initialized, apiKey, location } = useContext(AppContext);

  if (!initialized) {
    return null;
  }

  if (apiKey == null) {
    return <WelcomeView />;
  }

  if (location == null) {
    return <LocationPicker />;
  }

  return (
    <div>
      <section className="App-main">
        <div>API Key: { apiKey }</div>
        <div>Location: { location?.description }</div>
      </section>
    </div>
  );
}

export default MainComponent;
