import React, { createContext, useEffect, useState } from 'react';
import { storageConnector } from './StorageConnector';

const AppContext = createContext();

export const AppProvider = ({ children }) => {

  const [ state, setState ] = useState({
    initialized: false,
    apiKey: null,
    location: null,
    excludedSpecies: null,
    maxDistanceMiles: null,
    localSpecies: null,
  });

  const assignState = (newState) => {
    setState(
      (prevState) => ({ ...prevState, ...newState }),
      (updatedState) => storageConnector.saveState(updatedState)
    );
  };

  useEffect(() => {
    storageConnector.restoreState()
      .then(savedState => {
        setState(prevState => ({
          ...prevState,
          ...savedState,
          initialized: true,
        }));
    });
  });

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
