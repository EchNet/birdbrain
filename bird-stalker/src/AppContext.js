import React, { createContext, useEffect, useState } from 'react';
import { storageConnector } from './StorageConnector';

const AppContext = createContext();

const DEFAULT_MAX_DISTANCE_MILES = 22;

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
  const [ maxDistanceMiles, setMaxDistanceMiles ] = useState(DEFAULT_MAX_DISTANCE_MILES);

  useEffect(() => {
    storageConnector.restoreState()
      .then(savedState => {
        setInitialized(true);
        if (savedState) {
          const { apiKey, location, excludedSpecies, maxDistanceMiles } = savedState;
          setApiKey(apiKey);
          setLocation(location);
          setExcludedSpecies(listToHash(excludedSpecies));
          setMaxDistanceMiles(maxDistanceMiles);
        }
      });
  }, []);

  useEffect(() => {
    if (initialized) {
      storageConnector.saveState({
        apiKey, location, excludedSpecies: hashToList(excludedSpecies), maxDistanceMiles
      });
    }
  }, [ initialized, apiKey, location, excludedSpecies, maxDistanceMiles ]);


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
        value={{ initialized,
                 apiKey, setApiKey,
                 location, setLocation,
                 excludedSpecies, addExcludedSpecies, removeExcludedSpecies,
                 maxDistanceMiles, setMaxDistanceMiles }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
