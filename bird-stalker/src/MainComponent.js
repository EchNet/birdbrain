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
  const { apiKey, initialized, location } = useContext(AppContext);

  function requisitePath() {
    return !apiKey ? "/apiKey" : (!location ? "/location" : null);
  }

  function navTo(navPath) {
    return <Navigate to={navPath} />;
  }

  function navToRequisite() {
    const navPath = requisitePath();
    return navPath ? <Navigate to={navPath} /> : null;
  }

  return initialized ? (
    <BrowserRouter>
      <Header/>
      <Routes>
        <Route path="/about" exact element={<AboutView/>} />
        <Route path="/apikey" exact element={<ApiKeyView/>} />
        <Route path="/location" exact element={<LocationPicker/>} />
        <Route path="/birds" exact element={navToRequisite() || <BirdList/>} />
        <Route path="/bird/:speciesCode" exact element={navToRequisite() || <BirdSpeciesView/>} />
        <Route path="*" element={navTo(requisitePath() || "/birds")} />
      </Routes>
    </BrowserRouter>
  ) : null;
}

export default MainComponent;
