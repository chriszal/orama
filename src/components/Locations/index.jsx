import React, { useState, useRef } from 'react';
import { LocationsContainer } from './LocationsElements';
import Map from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css";

import mapboxgl from 'mapbox-gl';

// The following is required to stop "npm build" from transpiling mapbox code.
// notice the exclamation point in the import.
// @ts-ignore
// eslint-disable-next-line import/no-webpack-loader-syntax, import/no-unresolved
mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;



const MapComponent = () => {

  return (
    
    <LocationsContainer id="locations">
        <Map
          initialViewState={{
            longitude: -100,
            latitude: 40,
            zoom: 3.5
          }}
          mapboxAccessToken={process.env.REACT_APP_MAPBOX}
          style={{width: 600, height: 400}}
          mapStyle="mapbox://styles/mapbox/streets-v11"
        />
    </LocationsContainer>
    
  );
};

export default MapComponent;
