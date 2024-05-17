import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import { AppProvider } from './AppContext';
import { GoogleMapsProvider } from './GoogleMapsContext';
import MainComponent from './MainComponent';
import PhotoCarousel from './PhotoCarousel';

function App() {
  return (
    <CssBaseline>
      <AppProvider>
        <GoogleMapsProvider>
          <div className="main">
            <MainComponent/>
            <PhotoCarousel sources={[ "/img/birdstalker.png", "/img/birdstalker2.png" ]} />
          </div>
        </GoogleMapsProvider>
      </AppProvider>
    </CssBaseline>
  );
}

export default App;
