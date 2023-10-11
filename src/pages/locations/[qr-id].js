import Head from 'next/head';
import { Layout as LocationsLayout } from 'src/layouts/locations/layout';
import React, { useState, useContext } from 'react';
import { Card, CardContent, SvgIcon, Typography, Box, Button, TextField, IconButton,LinearProgress } from '@mui/material';
import CameraIcon from '@heroicons/react/24/solid/CameraIcon';
import LightBulbIcon from '@heroicons/react/24/solid/LightBulbIcon';
import { DialogContext } from 'src/contexts/dialog-context';
import InstructionsDialog from 'src/components/dialog-instructions';
import { getFirestore, getStorage } from 'src/config/firebase-config'
import { ref, uploadBytesResumable , getDownloadURL } from 'firebase/storage';
import { collection, addDoc, serverTimestamp ,doc } from 'firebase/firestore';
import { Progress } from '@nextui-org/react';
import Image from 'next/image'


function getAthensTimeISOString() {
  const date = new Date();
  const athensOffset = 3 * 60; // Athens is UTC +3 hours
  const offset = date.getTimezoneOffset() + athensOffset;
  const athensDate = new Date(date.getTime() + offset * 60 * 1000);
  return athensDate.toISOString();
}


const Page = () => {
  const { openDialog, closeDialog } = useContext(DialogContext);
  const [imageSrc, setImageSrc] = useState(null);
  const [name, setName] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if(!imageSrc) {
        alert("Please select an image to upload");
        return;
      }
      
      const db = getFirestore();
      const storage = getStorage();
    
      const fileName = getAthensTimeISOString();
      const storageRef = ref(storage, 'Images/' + fileName);
    
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      
      // Create a variable to store upload progress
      let uploadProgress = 0;
      
      // Upload image to Firebase Storage and track progress
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

        }, 
        async () => {
          const imageUrl = await getDownloadURL(storageRef);
          const qrCode = 'qr-code';
            
          // Reference to the Locations document
          const locationRef = doc(db, 'Locations', qrCode);
    
          const docRef = await addDoc(collection(db, 'UserUploads'), {
            location_qr_code: locationRef, // Using the document reference
            url: imageUrl,
            metadata: {
              user_name: name || 'Anonymous',
              capture_date_time: serverTimestamp(), 
              device_name: null,
              device_browser: null
            },
            is_approved: false
          });
            
          console.log("Document written with ID: ", docRef.id);
          setImageSrc(null);
          setName("");
          alert("Image uploaded successfully!");
          setUploadProgress(0);

        }
      );
        
    } catch (error) {
      console.error("Error: ", error);
      alert("Failed to upload image. Please try again later.");
    }
  };
  
  

  return (
    <>
      <Head>
        <title>Beam</title>
      </Head>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Card sx={{ maxWidth: 345, textAlign: 'center', position: 'relative' }}>
          
          <IconButton
            onClick={() => openDialog('How it Works', '', <InstructionsDialog onClose={closeDialog} />)}
            sx={{ position: 'absolute', right: 0, top: 0 }}
          >
            <SvgIcon color="action">
              <LightBulbIcon />
            </SvgIcon>
          </IconButton>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              Capture an Image
            </Typography>

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

            {/* Submit Button */}
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
    <Progress value={uploadProgress} color="primary" size="md" aria-label="Downloading..." showValueLabel={true}
      className="max-w-md" style={{ marginBottom: '16px' }} />



          </CardContent>
        </Card>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <LocationsLayout>{page}</LocationsLayout>;

export default Page;
