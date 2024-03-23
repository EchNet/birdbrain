import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import AppContext from './AppContext';
import WelcomeView from './WelcomeView';
import LocationPicker from './LocationPicker';
import BirdList from './BirdList';


function ActionMenu() {
  const { setLocation } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <div className="main">
      <h2>
        What's next, bird stalker?
      </h2>
      <div className="stack-menu">
        <Button variant="outlined">Suggest a quest</Button>
        <Button variant="outlined" onClick={() => navigate("/birds")}>See the list of local birds</Button>
        <Button variant="outlined">Upload my life list</Button>
        <Button variant="outlined" onClick={() => setLocation(null)}>Start Stalking Somewhere Else</Button>
        <Button variant="outlined">Update API Key</Button>
      </div>
      <div>
        <img src="/img/birdstalker.png" width="100%"/>
      </div>
    </div>
  );
}

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
    <BrowserRouter>
      <Routes>
        <Route path="/birds" element={<BirdList/>} />
        <Route path="*" element={<ActionMenu/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default MainComponent;
