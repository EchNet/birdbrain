import React, { createContext, useEffect, useState } from 'react';
import { storageConnector } from './StorageConnector';

const AppContext = createContext();

const TARGETED = 1;
const EXCLUDED = 2;

export function AppProvider({ children }) {

  const [ initialized, setInitialized ] = useState(false);
  const [ apiKey, setApiKey ] = useState(null);
  const [ location, setLocation ] = useState(null);
  const [ species, setSpecies ] = useState([]);
  const [ menuOpen, setMenuOpen ] = useState(false);

  useEffect(() => {
    storageConnector.restoreState()
      .then(savedState => {
        setInitialized(true);
        if (savedState) {
          const { apiKey, location, species } = savedState;
          if (apiKey) {
            setApiKey(apiKey);
          }
          if (location) {
            setLocation(location);
          }
          if (species) {
            setSpecies(species);
          }
        }
      });
  }, []);


  useEffect(() => {
    if (initialized) {
      storageConnector.saveState({
        apiKey,
        location,
        species,
      });
    }
  }, [ initialized, apiKey, location, species ]);

  function speciesIsTargeted(speciesCode) {
    return species[speciesCode] === TARGETED;
  }

  function speciesIsExcluded(speciesCode) {
    return species[speciesCode] === EXCLUDED;
  }

  function addSpeciesToList(speciesCode, listId) {
    if (species[speciesCode] !== listId) {
      setSpecies(Object.assign({}, species, { [speciesCode]: listId }));
    }
  }

  function addSpeciesToTargetedList(speciesCode) {
    addSpeciesToList(speciesCode, TARGETED);
  }

  function addSpeciesToExcludedList(speciesCode) {
    addSpeciesToList(speciesCode, EXCLUDED);
  }

  function removeSpeciesFromItsList(speciesCode) {
    if (species[speciesCode]) {
      const newSpecies = Object.assign({}, species);
      delete newSpecies[speciesCode];
      setSpecies(newSpecies);
    }
  }

  return (
    <AppContext.Provider
        value={{ 
               initialized,
               apiKey, setApiKey,
               location, setLocation,
               speciesIsTargeted, speciesIsExcluded,
               addSpeciesToTargetedList, addSpeciesToExcludedList,
               removeSpeciesFromItsList,
               menuOpen, setMenuOpen }}>
      {children}
    </AppContext.Provider>
  )
}

export default AppContext;
