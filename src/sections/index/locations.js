import React from 'react';
import { Box, Typography, Container, Button, Card, Grid } from '@mui/material';
import Map from 'react-map-gl';
import "mapbox-gl/dist/mapbox-gl.css";


const Locations = () => {
    const [viewport, setViewport] = React.useState({
        latitude: 37.9838,
        longitude: 23.7275, 
        zoom: 9
      });

  return (
    <Box 
      id="locations" 
      sx={{ 
        display: 'flex', 
        alignItems: 'center',
        height: '860px', 
        justifyContent: 'center', 
        flexGrow: 1 
      }}
    >
      <Container maxWidth="md">
      <Grid container spacing={3} direction={['column-reverse', 'row']}>
      <Grid item xs={12} md={6}>
            {/* Left Side: Map */}
            <Card sx={{ height: { xs: '300px', md: '400px' }, width: '100%' }}>
              <Map
                {...viewport}
                width="100%"
                height="100%"
                mapStyle="mapbox://styles/mapbox/streets-v11"
                mapboxAccessToken={process.env.NEXT_PUBLIC_REACT_APP_MAPBOX}
                onViewportChange={setViewport}
              />
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            {/* Right Side: Text and Button */}
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                textAlign: 'center' 
              }}
            >
              <Typography variant="h3" gutterBottom>
                Main Title
              </Typography>
              <Typography variant="body1" paragraph>
                Description text here with a different typography variant.
              </Typography>
              <Button variant="contained" color="primary">
                Submit a New Location
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Locations;
