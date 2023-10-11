import Head from 'next/head';
import { Layout as LocationsLayout } from 'src/layouts/locations/layout';
import React, { useState } from 'react';
import { Card, CardContent,SvgIcon, Typography, Box, Button, TextField, IconButton } from '@mui/material';
import CameraIcon from '@heroicons/react/24/solid/CameraIcon';
import Image from 'next/image'

const Page = () => {
  const [imageSrc, setImageSrc] = useState(null);
  const [name, setName] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your submit logic here (e.g., send the image and name to server)
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
        <Card sx={{ maxWidth: 345, textAlign: 'center' }}>
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
          </CardContent>
        </Card>
      </Box>
    </>
  );
};

Page.getLayout = (page) => <LocationsLayout>{page}</LocationsLayout>;

export default Page;
