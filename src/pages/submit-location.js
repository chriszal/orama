import Head from 'next/head';
import { useState, useRef, useEffect, useContext } from 'react';
import mapboxgl from 'mapbox-gl';
import emailjs from '@emailjs/browser';
import { Box, Typography, Button, Container, TextField, Grid, Card, CardContent, Snackbar, Alert } from '@mui/material';
import { Layout as LocationsLayout } from 'src/layouts/locations/layout';
import { isPointInGreece } from 'src/utils/greece-bounds';
import { LoadingButton } from '@mui/lab';
import { AlertContext } from 'src/contexts/alert-context';

import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_REACT_APP_MAPBOX;

const Page = () => {
  const mapContainerRef = useRef(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [user_name, setName] = useState('');
  const [user_email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const mapRef = useRef();
  const markerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { showAlert } = useContext(AlertContext);



  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [23.8, 38],
      zoom: 5,
    });

    mapRef.current = map;

    const handleMapClick = (event) => {
      const lat = event.lngLat.lat;
      const lng = event.lngLat.lng;

      // Check if the clicked point is within Greece( very early access)
      if (isPointInGreece(lng, lat)) {
        setLocation({ latitude: lat, longitude: lng });

        if (markerRef.current) {
          markerRef.current.remove();
        }

        const newMarker = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(mapRef.current);

        markerRef.current = newMarker;
      } else {
        // Inform the user that pinning is allowed only within Greece
        showAlert('Only locations in greece allowed!', 'error');
      }
    };


    map.on('click', handleMapClick);

    return () => {
      if (mapRef.current) {
        mapRef.current.off('click', handleMapClick);
        mapRef.current.remove();
      }
      if (markerRef.current) {
        markerRef.current.remove();
      }
    };
  }, []);



  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    const google_maps_link = `https://www.google.com/maps/?q=${location.latitude},${location.longitude}`;


    const templateParams = {
      user_name,
      user_email,
      description,
      latitude: location.latitude,
      longitude: location.longitude,
      google_maps_link,
    };

    emailjs.send(
      process.env.NEXT_PUBLIC_REACT_APP_EMAIL_JS_ID,
      process.env.NEXT_PUBLIC_REACT_APP_EMAIL_JS_TEMPLATE_SUBMIT,
      templateParams,
      process.env.NEXT_PUBLIC_REACT_APP_EMAIL_JS_PUBLIC_KEY
    )
      .then((response) => {
        console.log('Email sent successfully!', response.status, response.text);
        setLoading(false);
        if (response.text === "OK") {
          showAlert('Email sent successfully!', 'success');

          // Reset form fields
          setName('');
          setEmail('');
          setDescription('');
          setLocation({ latitude: null, longitude: null });

          // Remove marker from map
          if (markerRef.current) {
            markerRef.current.remove();
            markerRef.current = null;
          }

        } else {
          setLoading(false);
          showAlert('Email failed to send', 'error');
        }
      })
      .catch((err) => {
        console.error('Failed to send email:', err);
        setLoading(false);
        showAlert('Email failed to send', 'error');
      });
  };


  return (
    <>
      <Head>
        <title>Submit a Location | Orama</title>
      </Head>
      <Container>
        <Typography variant="h4" align="center" mt={3}>Submit a New Location</Typography>
        <Grid container spacing={3} mt={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Choose Location on Map
                </Typography>
                <Typography variant="body2" paragraph>
                  Click on the map to pin the location where you want the new site to be added.
                </Typography>
                <Box ref={mapContainerRef} height={400} width="100%"></Box>
                <Typography variant="body2" color="red">
                  {(!location.latitude || !location.longitude) && "Please select a location on the map before submitting."}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Submit Details
                </Typography>
                <form onSubmit={handleSubmit}>
                  <TextField
                    label="Name"
                    fullWidth
                    margin="normal"
                    value={user_name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    value={user_email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <TextField
                    label="Description"
                    fullWidth
                    margin="normal"
                    helperText="Write down why you think your location would be good."
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <LoadingButton
                      variant="contained"
                      color="primary"
                      type="submit"
                      loading={loading}
                      disabled={!location.latitude || !location.longitude || loading}
                    >
                      Submit
                    </LoadingButton>
                  </Box>

                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

    </>
  );
};

Page.getLayout = (page) => <LocationsLayout>{page}</LocationsLayout>;

export default Page;
