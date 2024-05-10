import React, { useEffect, useState } from 'react';
import './PhotoCarousel.css';

const DEFAULT_PAUSE_MILLIS = 12000;  // 12 seconds

const ANIMATION_MILLIS = 4000;

function PhotoCarousel({ pauseMillis, sources }) {
  pauseMillis = pauseMillis || DEFAULT_PAUSE_MILLIS;
  sources = sources || [];

  const [ shownIndex, setShownIndex ] = useState(0);
  const [ active, setActive ] = useState(false);

  useEffect(() => {
    if (sources.length > 0) {
      const interval = setInterval(() => setShownIndex((shownIndex + 1) % sources.length), pauseMillis);
      return () => clearInterval(interval);
    }
  }, [sources, shownIndex, pauseMillis]);

  useEffect(() => {
    setTimeout(() => setActive(true), ANIMATION_MILLIS);
  }, []);

  return (
    <div className={`crossfade-container${active ? " active" : ""}`}>
      { sources.map((src, ix) => (
          <img key={"s" + ix} src={src} className={ix === shownIndex ? "shown" : "hidden"}
              width="100%" alt="Bird Stalker"/>
        ))
      }
    </div>
  );
}

export default PhotoCarousel;
