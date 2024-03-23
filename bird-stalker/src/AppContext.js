import React, { createContext, useCallback, useEffect, useState } from 'react';
import { storageConnector } from './StorageConnector';

const AppContext = createContext();

const DEFAULT_MAX_DISTANCE_MILES = 22;

export const AppProvider = ({ children }) => {

  const [ initialized, setInitialized ] = useState(false);
  const [ apiKey, setApiKey ] = useState(null);
  const [ location, setLocation ] = useState(null);
  const [ excludedSpecies, setExcludedSpecies ] = useState(null);
  const [ maxDistanceMiles, setMaxDistanceMiles ] = useState(DEFAULT_MAX_DISTANCE_MILES);

  useEffect(() => {
    storageConnector.restoreState()
      .then(savedState => {
        setInitialized(true);
        if (savedState) {
          const { apiKey, location, excludedSpecies, maxDistanceMiles } = savedState;
          setApiKey(apiKey);
          setLocation(location);
          setExcludedSpecies(excludedSpecies);
          setMaxDistanceMiles(maxDistanceMiles);
        }
      });
  }, []);

  useEffect(() => {
    if (initialized) {
      storageConnector.saveState({
        apiKey, location, excludedSpecies, maxDistanceMiles
      });
    }
  }, [ initialized, apiKey, location, excludedSpecies, maxDistanceMiles ]);

  return (
    <AppContext.Provider
        value={{ initialized,
                 apiKey, setApiKey,
                 location, setLocation,
                 excludedSpecies, setExcludedSpecies,
                 maxDistanceMiles, setMaxDistanceMiles }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
