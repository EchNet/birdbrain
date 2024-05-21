import React, { createContext, useEffect, useState } from 'react';
import { storageConnector } from './StorageConnector';

const AppContext = createContext();

export const DEFAULT_RADIUS_MILES = 22;

function listToHash(list) {
  const hash = {};
  if (list) {
    for (var i = 0; i < list.length; ++i) {
      hash[list[i]] = 1;
    }
  }
  return hash;
}

function hashToList(hash) {
  const list = [];
  if (hash) {
    for (var key in hash) {
      list.push(key);
    }
  }
  return list;
}

export const AppProvider = ({ children }) => {

  const [ initialized, setInitialized ] = useState(false);
  const [ apiKey, setApiKey ] = useState(null);
  const [ location, setLocation ] = useState(null);
  const [ excludedSpecies, setExcludedSpecies ] = useState([]);
  const [ radiusMiles, setRadiusMiles ] = useState(DEFAULT_RADIUS_MILES);
  const [ menuOpen, setMenuOpen ] = useState(false);

  useEffect(() => {
    storageConnector.restoreState()
      .then(savedState => {
        setInitialized(true);
        if (savedState) {
          const { apiKey, location, excludedSpecies, radiusMiles } = savedState;
          if (apiKey) setApiKey(apiKey);
          if (location) setLocation(location);
          if (excludedSpecies) setExcludedSpecies(listToHash(excludedSpecies));
          if (radiusMiles) setRadiusMiles(radiusMiles);
        }
      });
  }, []);


  useEffect(() => {
    if (initialized) {
      storageConnector.saveState({
        apiKey, location, excludedSpecies: hashToList(excludedSpecies), radiusMiles
      });
    }
  }, [ initialized, apiKey, location, excludedSpecies, radiusMiles ]);

  const addExcludedSpecies = (speciesCode) => {
    if (!excludedSpecies[speciesCode]) {
      const newExcludedSpecies = Object.assign({}, excludedSpecies, { [speciesCode]:1 });
      setExcludedSpecies(newExcludedSpecies);
    }
  };

  const removeExcludedSpecies = (speciesCode) => {
    if (excludedSpecies[speciesCode]) {
      const newExcludedSpecies = Object.assign({}, excludedSpecies);
      delete newExcludedSpecies[speciesCode];
      setExcludedSpecies(newExcludedSpecies);
    }
  };

  return (
    <AppContext.Provider
        value={{ 
                 initialized,
                 apiKey, setApiKey,
                 location, setLocation,
                 excludedSpecies, addExcludedSpecies, removeExcludedSpecies,
                 radiusMiles, setRadiusMiles,
                 menuOpen, setMenuOpen }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
