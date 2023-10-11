import Head from 'next/head';
import { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import emailjs from '@emailjs/browser';
import { Box, Typography, Button, Container, TextField, Grid, Card, CardContent, Snackbar, Alert } from '@mui/material';
import { Layout as LocationsLayout } from 'src/layouts/locations/layout';

import { LoadingButton } from '@mui/lab';

import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_REACT_APP_MAPBOX;

const Page = () => {
  const mapContainerRef = useRef(null);
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [user_name, setName] = useState('');
  const [user_email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isError, setIsError] = useState(false);
  const mapRef = useRef();
  const markerRef = useRef(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/outdoors-v12',
      center: [23.8, 38],
      zoom: 5,
    });

    mapRef.current = map;

    const handleMapClick = (event) => {
      setLocation({ latitude: event.lngLat.lat, longitude: event.lngLat.lng });

      if (markerRef.current) {
        markerRef.current.remove();
      }

      const newMarker = new mapboxgl.Marker()
        .setLngLat([event.lngLat.lng, event.lngLat.lat])
        .addTo(mapRef.current);

      markerRef.current = newMarker;
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
          setIsSent(true);

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
          setIsError(true);
        }
      })
      .catch((err) => {
        console.error('Failed to send email:', err);
        setLoading(false);
        setIsError(true);
      });
  };


  const handleClose = () => {
    setIsSent(false);
    setIsError(false);
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
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={user_name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={user_email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <TextField
                    label="Description"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    helperText="Write down why you think your location would be good."
                    multiline
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    type="submit"
                    loading={loading}
                    disabled={!location.latitude || !location.longitude || loading}
                    >
                    Submit
                  </LoadingButton>
                  
                </form>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Snackbar open={isSent} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Email sent successfully
        </Alert>
      </Snackbar>
      <Snackbar open={isError} autoHideDuration={5000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          Email failed to send
        </Alert>
      </Snackbar>
    </>
  );
};

Page.getLayout = (page) => <LocationsLayout>{page}</LocationsLayout>;

export default Page;
