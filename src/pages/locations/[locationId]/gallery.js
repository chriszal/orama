import Head from 'next/head';
import { Layout as LocationsLayout } from 'src/layouts/locations/layout';
import React, { useState, useContext, useEffect } from 'react';
import { Drawer, AppBar, Toolbar, List, ListItem, ListItemText, Divider, Card, Chip, Skeleton, CardHeader, CardContent, Grid, CardActionArea, SvgIcon, Typography, Box, Button, TextField, IconButton, LinearProgress } from '@mui/material';
import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon';
import MagnifyingGlassIcon from '@heroicons/react/24/solid/MagnifyingGlassIcon';
import FunnelIcon from '@heroicons/react/24/solid/FunnelIcon';

import { DialogContext } from 'src/contexts/dialog-context';
import { AlertContext } from 'src/contexts/alert-context';
import { getFirestore, getStorage } from 'src/config/firebase-config'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDoc, serverTimestamp, doc, query, where, orderBy, getDocs } from 'firebase/firestore';
import Image from 'next/image'
import { useRouter } from 'next/router';
import MapPinIcon from '@heroicons/react/24/solid/MapPinIcon';
import NewtonsCradle from 'src/components/newtons-cradle-component';

import { Scrollbar } from 'src/components/scrollbar';


const db = getFirestore();


const Page = () => {
  const [locationName, setLocationName] = useState(null);
  const [loading, setLoading] = useState(true);
  const { openDialog, closeDialog } = useContext(DialogContext);
  const { showAlert } = useContext(AlertContext);
  const [searchUsername, setSearchUsername] = useState('');
  const [uploads, setUploads] = useState([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);


  const router = useRouter();
  const { locationId } = router.query;
  const [isZoomed, setIsZoomed] = useState(false);


  const firestoreTimestampToDate = (timestamp) => {
    return new Date(timestamp.seconds * 1000);
  };
  const toggleDrawer = (open) => () => {
    setDrawerOpen(open);
  };


  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const time = date.toLocaleTimeString();

    return `${day}/${month}/${year}, ${time}`;
  };

  const handleCardClick = (upload) => {
    openDialog(
      "",
      "",
      <>

        <Box position="relative" height="80%" width="100%">

          <IconButton
            style={{
              position: 'absolute',
              right: 10,
              top: 10,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white'
            }}
            onClick={closeDialog}
          >
            <SvgIcon>
              <XMarkIcon />
            </SvgIcon>
          </IconButton>
          <Image
            src={upload.url}
            alt="Uploaded Image"
            layout="responsive"
            objectFit="contain"
            width={100}
            height={100}
          />
          <Box position="absolute" bottom={5} left={5}>
            <Chip
              label={formatDate(firestoreTimestampToDate(upload.metadata.capture_date_time))}
              color="primary"
              style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
            />
          </Box>
        </Box>
      </>
    );
  };



  useEffect(() => {
    if (locationId) {
      const checkLocationExists = async () => {
        console.log("Checking existence for locationId:", locationId);

        const locationDocRef = doc(db, 'Locations', locationId);
        const locationDocSnapshot = await getDoc(locationDocRef);

        const locationData = locationDocSnapshot.data();
        if (!locationData || !locationData.location_name || !locationData.is_activated) {
          console.log("Location data, location_name does not exist, or is not activated, redirecting to 404");
          router.push('/404');
        } else {
          setLocationName(locationData.location_name);
        }

      };

      checkLocationExists();
    }
  }, [locationId]);





  useEffect(() => {
    const fetchUserUploads = async () => {
      if (locationId) {
        setLoading(true);
        const q = query(
          collection(db, "UserUploads"),
          where("location_qr_code", "==", doc(db, "Locations", locationId)),
          where("is_approved", "==", true),
          orderBy("metadata.capture_date_time", "desc")
        );

        const querySnapshot = await getDocs(q);
        const fetchedUploads = [];
        querySnapshot.forEach(doc => {
          fetchedUploads.push(doc.data());
        });
        setUploads(fetchedUploads);

        setLoading(false);
      }
    };

    fetchUserUploads();
  }, [locationId]);






  return (
    <>
      <Head>
        <title>Gallery | Orama</title>
      </Head>
      <Typography variant="h4" align="center" gutterBottom>
        Gallery
      </Typography>
      <Grid container spacing={3} justifyContent="center" px={5} py={3}>

        {/* <TextField
                variant="outlined"
                placeholder="Search picture by username"
                value={searchUsername}
                onChange={e => setSearchUsername(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <IconButton>
                      <SvgIcon><MagnifyingGlassIcon /></SvgIcon>

                    </IconButton>
                  ),
                }}
              /> */}


        {
          loading ? (
            <Grid item>
            <NewtonsCradle />
          </Grid>

          ) : uploads.length === 0 || !uploads.some(upload => upload.metadata.user_name.toLowerCase().includes(searchUsername.toLowerCase())) ? (
            <Typography variant="h6" align="center">
              {searchUsername ? `No images available for "${searchUsername}"` : "No images available"}
            </Typography>
          ) : (
            uploads
              .filter(upload => upload.metadata.user_name.toLowerCase().includes(searchUsername.toLowerCase()))
              .map(upload => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={upload.url}>
                  <Card sx={{ width: { xs: '100%', sm: '90%', md: '90%', lg: '100%' }, height: 'auto', overflow: 'hidden', textAlign: 'center', mb: 3 }} onClick={() => handleCardClick(upload)}>
                    <CardActionArea>
                      <Box sx={{ height: 220, position: 'relative', borderRadius: '16px', overflow: 'hidden' }}>

                        <Image
                          src={upload.url}
                          alt="Uploaded Image"
                          layout="fill"
                          objectFit="cover"
                        />

                      </Box>



                      <CardHeader sx={{ mt: -2 }} title={upload.metadata.user_name} subheader={formatDate(firestoreTimestampToDate(upload.metadata.capture_date_time))} />
                      <CardContent sx={{ mt: -5 }}>

                        <Scrollbar
                          sx={{
                            maxHeight: '70px',
                            '& .simplebar-content': {
                              height: '100%'
                            },
                            '& .simplebar-scrollbar:before': {
                              background: 'neutral.400'
                            }
                          }}
                        >
                          <Typography variant="body2" color="text.secondary">
                            ❝{upload.metadata.user_note}❞
                          </Typography>
                        </Scrollbar>

                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))
          )}

      </Grid>
      {/* 
      <IconButton
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 2000,
        }}
        onClick={toggleDrawer(true)}
      >
        <SvgIcon>
          <FunnelIcon />
        </SvgIcon>
      </IconButton>
      <Drawer
    anchor="right"
    open={isDrawerOpen}
    onClose={toggleDrawer(false)}
>
    <div
        style={{ width: 250 }}
        role="presentation"
        onKeyDown={toggleDrawer(false)}
    >
        <AppBar position="static">
            <Toolbar>
                Filters
            </Toolbar>
        </AppBar>
        <List>
            <ListItem>
                <TextField
                    variant="outlined"
                    placeholder="Search"
                    fullWidth
                    InputProps={{
                        startAdornment: (
                            <IconButton>
                                <SvgIcon><MagnifyingGlassIcon /></SvgIcon>
                            </IconButton>
                        ),
                    }}
                />
            </ListItem>
        </List>
    </div>
</Drawer> */}

    </>
  );
};

Page.getLayout = (page) => <LocationsLayout>{page}</LocationsLayout>;

export default Page;
