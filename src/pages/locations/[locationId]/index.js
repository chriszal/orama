import Head from 'next/head';
import { Layout as LocationsLayout } from 'src/layouts/locations/layout';
import React, { useState, useContext, useEffect } from 'react';
import { Card, CardHeader, CardContent, SvgIcon, Typography, Box, Button, TextField, IconButton, LinearProgress } from '@mui/material';
import CameraIcon from '@heroicons/react/24/solid/CameraIcon';
import LightBulbIcon from '@heroicons/react/24/outline/LightBulbIcon';
import MapPinIcon from '@heroicons/react/24/solid/MapPinIcon';
import { DialogContext } from 'src/contexts/dialog-context';
import { AlertContext } from 'src/contexts/alert-context';
import InstructionsDialog from 'src/components/dialog-instructions';
import { getFirestore, getStorage } from 'src/config/firebase-config'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc, getDoc, serverTimestamp, doc } from 'firebase/firestore';
import { SuccessDialogComponent } from 'src/components/success-dialog-component';
import Image from 'next/image'
import { useRouter } from 'next/router';
import { getUserLocation } from 'src/utils/get-user-location';
import { calculateDistance } from 'src/utils/calculate-distance';
import { getAthensTimeISOString } from 'src/utils/get-athens-time';
import { getBrowserInfo } from 'src/utils/get-browser-info';
const db = getFirestore();


const Page = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [locationName, setLocationName] = useState("");

  const { openDialog, closeDialog } = useContext(DialogContext);
  const { showAlert } = useContext(AlertContext);
  const [imageSrc, setImageSrc] = useState(null);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();
  const { locationId } = router.query;


  useEffect(() => {
    if (locationId) {
      const checkLocationExists = async () => {
        try {
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


          // const userLocation = await getUserLocation();
          // console.log(userLocation);
          // const location = { lat: locationData.location.latitude, lng: locationData.location.longitude }; 
          // console.log(location);
          // console.log(getBrowserInfo());
          // if (!userLocation) return; 

          // const distance = calculateDistance(
          //   userLocation.lat, userLocation.lon,
          //   location.lat, location.lon
          // );

          // if (distance <= 20) {
          //   console.log("User is within the acceptable range.");
          // } else {
          //   console.log("User is out of range.");
          // }

        } catch (error) {
          console.error("Error checking location existence:", error);
        }

      };

      checkLocationExists();
    }
  }, [locationId]);



  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImageSrc(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };


  const getLocationData = async (locationId) => {
    const locationDocRef = doc(db, 'Locations', locationId);
    const locationDocSnapshot = await getDoc(locationDocRef);

    if (!locationDocSnapshot.exists) {
      router.push('/404');
      return null;
    }

    return locationDocSnapshot.data().location_name;
  };


  const confirmUpload = async () => {

    if (!imageSrc) {
      showAlert('Please take photo first!', 'error');
      return;
    }

    const result = await openDialog(
      'Are you sure?',
      'Do you want to upload this photo?',
      (
        <>
          <Button autoFocus onClick={closeDialog}>
            Cancel
          </Button>
          <Button autoFocus onClick={handleSubmit}>
            Upload
          </Button>

        </>
      )
    );
  }



  const handleSubmit = async (e) => {
    e.preventDefault();
    closeDialog();
    setIsLoading(true);

    try {
      if (!imageSrc) {
        showAlert('Please take photo first!', 'error');
        return;
      }

      const storage = getStorage();

      const fileName = getAthensTimeISOString();
      const locationName = await getLocationData(locationId);
      if (!locationName) return;
      const storageRef = ref(storage, `${locationName}/${fileName}`);


      const response = await fetch(imageSrc);
      const blob = await response.blob();

      let uploadProgress = 0;

      const uploadTask = uploadBytesResumable(storageRef, blob);

      uploadTask.on('state_changed',
        (snapshot) => {
          // Get the upload progress as percentage
          uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(uploadProgress);
          console.log('Upload is ' + uploadProgress + '% done');

          // You may use 'uploadProgress' to update a progress bar in UI
        },
        (error) => {
          console.error("Error uploading image: ", error);
          setUploadProgress(0);
          setIsLoading(false);

        },
        async () => {
          const imageUrl = await getDownloadURL(storageRef);

          // Reference to the Locations document
          const locationRef = doc(db, 'Locations', locationId);

          const docRef = await addDoc(collection(db, 'UserUploads'), {
            location_qr_code: locationRef, // Using the document reference
            url: imageUrl,
            metadata: {
              user_name: name || 'Anonymous',
              user_note: note,
              capture_date_time: serverTimestamp(),
              device_name: null,
              device_browser: null
            },
            is_approved: false
          });

          console.log("Document written with ID: ", docRef.id);
          setImageSrc(null);
          setName("");
          setNote("");
          showAlert('Image submitted sucessfully!', 'success');
          openDialog('', '', <SuccessDialogComponent
            onClose={closeDialog}
            goToGallery={() => router.push(`/locations/${locationId}/gallery`)}
            goToHome={() => router.push(`/`)}

          />);
          setUploadProgress(0);
          setIsLoading(false);

        }
      );

    } catch (error) {
      console.error("Error: ", error);
      showAlert("Failed to upload image. Please try again later.", "error");
      setIsLoading(false);
    }

  };



  return (
    <>
      <Head>
        <title>Capture a photo | Orama</title>
      </Head>

      {isLoading && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000
          }}
        >
          <Typography
            variant="h6"
            color="white"
            sx={{ marginBottom: '0.5em' }}
          >
            {Math.round(uploadProgress)}%
          </Typography>
          <Box
            sx={{
              width: '80%',
              color: "#FFF",
            }}
          >
            <LinearProgress
              variant="determinate"
              value={uploadProgress}
            />
          </Box>
        </Box>
      )}





      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 5
        }}
      >

        {locationName && (
          <Card sx={{ maxWidth: 345, textAlign: 'center', mb: 3 }}>
            <CardContent>
              <SvgIcon sx={{ color: "red" }}>
                <MapPinIcon />
              </SvgIcon>
              <Typography variant="h6">

                You’re on the {locationName}
              </Typography>
            </CardContent>
          </Card>
        )}
        <Card sx={{ maxWidth: 345, textAlign: 'center', position: 'relative' }}>
          <CardHeader
            title="Capture an Image"
            action={
              <IconButton
                onClick={() => openDialog('', '', <InstructionsDialog onClose={closeDialog} />)}
                sx={{ color: 'gray' }}
              >
                <SvgIcon >
                  <LightBulbIcon />
                </SvgIcon>
              </IconButton>
            }
          />
          <CardContent>
            {/* Image Preview and Input Box */}
            <Box
              component="label"

              sx={{
                width: '100%',
                height: '200px',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '2px dashed lightgray',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                cursor: 'pointer',
                mb: 2,
              }}
            >
              <input
                accept="image/*"
                type="file"
                style={{ display: 'none' }}
                onChange={handleImageChange}
                capture
              />
              {imageSrc ? (
                <Image src={imageSrc} alt="Captured preview" layout="fill" objectFit="cover" />
              ) : (
                <>
                  <SvgIcon color="primary">
                    <CameraIcon />
                  </SvgIcon>
                  <Typography variant="body2" color="textSecondary">
                    Take a Photo
                  </Typography>
                </>
              )}
            </Box>

            {/* Name Input */}
            <TextField
              variant="outlined"
              fullWidth
              label="Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              sx={{ mb: 2 }}
            />

            {/* Note Input */}
            <TextField
              variant="outlined"
              fullWidth
              label="Write a Note (optional)"
              value={note}
              multiline
              rows={4}
              onChange={(e) => setNote(e.target.value)}
              sx={{ mb: 2 }}
            />

            {/* Submit Button */}
            <Button variant="contained" color="primary" onClick={confirmUpload}>
              Submit
            </Button>


          </CardContent>
        </Card>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <LocationsLayout>{page}</LocationsLayout>;

export default Page;
