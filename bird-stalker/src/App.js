import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import { AppProvider } from './AppContext';
import MainComponent from './MainComponent';
import PhotoCarousel from './PhotoCarousel';

function App() {
  return (
    <CssBaseline>
      <AppProvider>
        <div className="main">
          <MainComponent/>
        </div>
        <div className="carousel">
          <PhotoCarousel sources={[ "/img/birdstalker.png", "/img/birdstalker2.png" ]} />
        </div>
      </AppProvider>
    </CssBaseline>
  );
}

export default App;
