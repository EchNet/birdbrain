import React from 'react';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import { AppProvider } from './AppContext';
import MainComponent from './MainComponent';

function App() {
  return (
    <AppProvider>
      <div className="main">
        <MainComponent/>
      </div>
    </AppProvider>
  );
}

export default App;
