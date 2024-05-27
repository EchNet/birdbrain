import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

export function Loader({ children, initialized }) {
  return (
    initialized ? <>{ children }</> : <div className="spinner-container"><CircularProgress/></div>
  )
}

export default Loader;
