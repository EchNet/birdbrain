import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import AppContext from './AppContext';

import './HamburgerButton.css';


function ActionMenu({ minimized }) {
  const { apiKey, location, setMenuOpen } = useContext(AppContext);
  const navigate = useNavigate();

  const birdListDisabled = !apiKey || !location;
  const locationPrompt = location ? "Start stalking somewhere else" : "Choose where to stalk";
  const apiKeyPrompt = apiKey ? "Update API Key" : "Connect to ebird.org API";

  function goto(path) {
    setMenuOpen(false);
    navigate(path);
  }

  return (
    <div className={`action-menu${minimized ? " minimized" : ""}`}>
      <Button variant="outlined" disabled={birdListDisabled}
          onClick={() => navigate("/birds")}>See the list of local birds</Button>
      <Button variant="outlined" onClick={() => goto("/location")}>{locationPrompt}</Button>
      <Button variant="outlined" onClick={() => goto("/apikey")}>{apiKeyPrompt}</Button>
      <Button variant="outlined" onClick={() => goto("/about")}>About Bird Stalker</Button>
    </div>
  )
}


function Header() {
  const { menuOpen, setMenuOpen } = useContext(AppContext);

  function handleHamburgerClick() {
    setMenuOpen(!menuOpen);
  }

  return (
    <>
      <div className="header-strip">
        <img className="striplogo" src="/img/striplogo.png" alt="Bird Stalker"/>

        <div className={`hamburger-button${ menuOpen ? " close" : ""}`} onClick={handleHamburgerClick}>
          <div className="btn-line" />
          <div className="btn-line" />
          <div className="btn-line" />
        </div>
      </div>
      <ActionMenu minimized={!menuOpen}/>
    </>
  );
}

export default Header;
