import React, { useState, useRef, useEffect } from 'react';
import { Box,Card, Typography, Container, Button, Grid } from '@mui/material';
import mapboxgl from 'mapbox-gl';
import "mapbox-gl/dist/mapbox-gl.css";
import Link from 'next/link';
import { getFirestore } from 'src/config/firebase-config'

import { collection,query, where, getDocs } from 'firebase/firestore';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_REACT_APP_MAPBOX;

const useLocations = () => {
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const db = getFirestore();
      const locationsRef = collection(db, 'Locations');
      const q = query(locationsRef, where("is_activated", "==", true));
      const querySnapshot = await getDocs(q);
      
      const locationsData = querySnapshot.docs.map(doc => ({
        id: doc.id, 
        ...doc.data()
      }));
      setLocations(locationsData);
    };
    
    fetchData();
  }, []);

  return locations;
};


const useMap = (locations, mapContainerRef) => {
  const [map, setMap] = useState(null);
  
  useEffect(() => {
    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [23.8, 38],
      zoom: 5,
    });

    setMap(mapInstance);
  }, [mapContainerRef]);

  useEffect(() => {
    if (map && locations.length > 0) {
      locations.forEach((location) => {
        const el = document.createElement('div');
        el.className = 'map-pin';
        const img = document.createElement('img');
        img.src = '/assets/pin.svg';  
        img.alt = 'Map Pin';
        img.style.width = '20px'; 
        img.style.height = '20px'; 
        el.appendChild(img);
        
        const coordinates = [location.location.longitude, location.location.latitude];
        
        new mapboxgl.Marker(el)
          .setLngLat(coordinates)
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <h3>${location.location_name}</h3>
          <button 
            onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${coordinates[1]},${coordinates[0]}', '_blank')" 
            style="background-color: #4285F4; color: white; border: none; padding: 10px 15px; margin-right: 10px; cursor: pointer; border-radius: 5px;">
            <img src="/assets/google-maps.png" alt="Google Maps Icon" style="width: 16px; vertical-align: middle; margin-right: 5px;" /> 
            Get Directions
          </button>
          <button 
            onclick="window.location.href='/locations/${location.id}/gallery'" 
            style="background-color: #34A853; color: white; border: none; padding: 10px 15px; cursor: pointer; border-radius: 5px;">
            See More
          </button>
        `))
          .addTo(map);
      });
    }
  }, [map, locations]);
};

const Locations = () => {
  const mapContainerRef = useRef(null);
  const locations = useLocations();

  useMap(locations, mapContainerRef);
  
  return (
    <>
      <Box
        id="locations"
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: '860px',
          justifyContent: 'center',
          flexGrow: 1,
        }}
      >
        <Container>
          <Grid container spacing={3} direction={['column-reverse', 'row']}>
            <Grid item xs={12} md={6}>
              <Card sx={{ height: { xs: '300px', md: '400px' }, width: '100%' }}>
                <Box ref={mapContainerRef} sx={{ height: 400, width: '100%' }} />
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h3" gutterBottom>
                  Explore the Locations
                </Typography>
                <Typography variant="body1" paragraph>
                  Find our collection of locations and share your own favorite spots to be added to the project.
                </Typography>
                <Link href="/submit-location" passHref>
                  <Button variant="contained" color="primary">
                    Submit a New Location
                  </Button>
                </Link>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
};

export default Locations;
