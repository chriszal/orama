import React from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import { Button, Typography, Box, DialogContent, IconButton, Link, SvgIcon, Divider } from '@mui/material';
import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon';
import HomeIcon from '@heroicons/react/24/outline/HomeIcon';
import { FaTwitter } from 'react-icons/fa';

export const SuccessDialogComponent = ({ onClose, goToGallery, goToHome }) => {
  const handleTwitterButtonClick = () => {
    const tweetText = "I just contributed to the @oramainitiative! 📸 #CaptureTheChange";
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, '_blank');
  };

  return (
    <>
      {/* <IconButton
        style={{ position: 'absolute', right: 0, top: 0 }}
        onClick={onClose}
      >
        <SvgIcon> <XMarkIcon /></SvgIcon>
      </IconButton> */}

      <IconButton
        style={{ position: 'absolute', left: 0, top: 0 }}
        onClick={() => {
          onClose(); 
          goToHome();  
        }}
      >
        <SvgIcon><HomeIcon /></SvgIcon>
      </IconButton>
      <Box textAlign="center" padding={2}>
        <ConfettiExplosion />
        <Typography variant="h4" gutterBottom>
          Thank you
        </Typography>
        <Typography variant="body1" gutterBottom>
          Your contribution is very valuable. You can capture a photo again next time you pass this location or you can see the weekly pictures from this location by clicking{' '}
          <Link onClick={() => {
            onClose(); 
            goToGallery();  
          }} style={{ cursor: 'pointer' }}>
            here
          </Link>
          .
        </Typography>
        <Divider />
        <Box display="flex" alignItems="center" justifyContent="center" marginTop={2}>
          <Button
            variant="contained"
            style={{ backgroundColor: '#26a7de' }}
            onClick={handleTwitterButtonClick}
            startIcon={<FaTwitter fontSize="large" />}
          >
            Share on Twitter
          </Button>
        </Box>
      </Box>
    </>
  );
};
