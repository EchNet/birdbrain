import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import AppContext from './AppContext';

import './HamburgerButton.css';


function ActionMenu(props) {
  const { apiKey, location } = useContext(AppContext);
  const navigate = useNavigate();

  const birdListDisabled = !apiKey || !location;
  const locationPrompt = location ? "Start stalking somewhere else" : "Choose a location to stalk";
  const apiKeyPrompt = apiKey ? "Update API Key" : "Connect to ebird.org API";

  return (
    <div className="action-menu">
      <Button variant="outlined" disabled={birdListDisabled}
          onClick={() => navigate("/birds")}>See the list of local birds</Button>
      <Button variant="outlined" onClick={() => navigate("/location")}>{locationPrompt}</Button>
      <Button variant="outlined" onClick={() => navigate("/apikey")}>Update API Key</Button>
      <Button variant="outlined" onClick={() => navigate("/about")}>About Bird Stalker</Button>
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
        <img src="/img/striplogo.png" height="48" alt="Bird Stalker"/>

        <div className={`hamburger-button${ menuOpen ? " close" : ""}`} onClick={handleHamburgerClick}>
          <div className="btn-line" />
          <div className="btn-line" />
          <div className="btn-line" />
        </div>
      </div>
      { menuOpen ? <ActionMenu/> : null }
    </>
  );
}

export default Header;
