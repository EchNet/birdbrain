import React, { useContext } from 'react';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import AboutView from './AboutView';
import AppContext from './AppContext';
import ApiKeyView from './ApiKeyView';
import Header from './Header';
import LocationPicker from './LocationPicker';
import BirdList from './BirdList';
import BirdSpeciesView from './BirdSpeciesView';

function MainComponent() {
  const { initialized, apiKey, location } = useContext(AppContext);

  return initialized ? (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/apikey" exact element={<ApiKeyView/>} />;
        <Route path="/location" exact element={<LocationPicker/>} />;
        <Route path="/birds" exact render={() => (
          !apiKey ? <Navigate to="/apiKey"/> :
          !location ? <Navigate to="/location"/> :
          <BirdList/>)} />
        <Route path="/bird/:speciesCode" exact render={() => (
          !apiKey ? <Navigate to="/apiKey"/> :
          !location ? <Navigate to="/location"/> :
          <BirdSpeciesView/>)} />
        <Route path="*" element={<AboutView/>} />
      </Routes>
    </BrowserRouter>
  ) : null;
}

export default MainComponent;
