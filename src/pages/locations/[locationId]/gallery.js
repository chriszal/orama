import Head from 'next/head';
import { Layout as LocationsLayout } from 'src/layouts/locations/layout';
import React, { useState, useContext, useEffect } from 'react';
import { Card, CardHeader, CardContent, SvgIcon, Typography, Box, Button, TextField, IconButton, LinearProgress } from '@mui/material';
import CameraIcon from '@heroicons/react/24/solid/CameraIcon';
import LightBulbIcon from '@heroicons/react/24/solid/LightBulbIcon';
import { DialogContext } from 'src/contexts/dialog-context';
import { AlertContext } from 'src/contexts/alert-context';
import InstructionsDialog from 'src/components/dialog-instructions';
import { getFirestore, getStorage } from 'src/config/firebase-config'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDoc, serverTimestamp, doc } from 'firebase/firestore';
import { SuccessDialogComponent } from 'src/components/success-dialog-component';
import Image from 'next/image'
import { useRouter } from 'next/router';

import { getAthensTimeISOString } from 'src/utils/get-athens-time';
const db = getFirestore();


const Page = () => {

  const { openDialog, closeDialog } = useContext(DialogContext);
  const { showAlert } = useContext(AlertContext);
  const router = useRouter();
  const { locationId } = router.query;

  useEffect(() => {
    if (locationId) {
      const checkLocationExists = async () => {
        console.log("Checking existence for locationId:", locationId);

        const locationDocRef = doc(db, 'Locations', locationId);
        const locationDocSnapshot = await getDoc(locationDocRef);

        const locationData = locationDocSnapshot.data();
        if (!locationData || !locationData.location_name  || !locationData.is_activated) {
          console.log("Location data, location_name does not exist, or is not activated, redirecting to 404");
          router.push('/404');
        }

      };

      checkLocationExists();
    }
  }, [locationId]);




  const getLocationData = async (locationId) => {
    const locationDocRef = doc(db, 'Locations', locationId);
    const locationDocSnapshot = await getDoc(locationDocRef);

    if (!locationDocSnapshot.exists) {
      router.push('/404');
      return null;
    }

    return locationDocSnapshot.data().location_name;
  };









  return (
    <>
      <Head>
        <title>Gallery | Orama</title>
      </Head>

      



    </>
  );
};

Page.getLayout = (page) => <LocationsLayout>{page}</LocationsLayout>;

export default Page;
