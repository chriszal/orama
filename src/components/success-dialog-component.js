import React from 'react';
import ConfettiExplosion from 'react-confetti-explosion';
import { Button, Typography, DialogTitle, DialogContent, IconButton, Link, SvgIcon } from '@mui/material';
import XMarkIcon from '@heroicons/react/24/solid/XMarkIcon';

export const SuccessDialogComponent = ({ onClose, goToMain, viewLogs }) => {
  return (
    <>
      <DialogTitle>
        Thank You!
        <IconButton 
          style={{ position: 'absolute', right: 0, top: 0 }} 
          onClick={onClose}
        >
            <SvgIcon> <XMarkIcon /></SvgIcon>
         
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <ConfettiExplosion />
        <Typography variant="body1" gutterBottom>
          Thank you for participating and contributing to our platform. Keep in mind that if you ever pass this location again, don't be afraid to log another picture because it helps out.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          onClick={goToMain}
        >
          More Info
        </Button>
        <Button
          variant="outlined"
          color="primary"
          component={Link}
          href="https://www.buymeacoffee.com/YourPage" 
          target="_blank" 
          rel="noopener noreferrer"
        >
          Support Us
        </Button>
        <Button 
          variant="text" 
          color="primary" 
          onClick={viewLogs}
        >
          View Logs From Others
        </Button>
      </DialogContent>
    </>
  );
};
