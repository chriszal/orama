import { Box, Link as MuiLink, IconButton, SvgIcon, Typography } from '@mui/material';
import React, { useState, useContext, useEffect } from 'react';
import Link from 'next/link';
import { alpha } from '@mui/material/styles';
import HomeIcon from '@heroicons/react/24/outline/HomeIcon';
import { getFirestore } from 'src/config/firebase-config'
import { collection, addDoc, getDoc, serverTimestamp, doc, query, where, orderBy, getDocs } from 'firebase/firestore';
import { LanguagePopover } from '../language-popover'

import { Logo } from 'src/components/logo';

import { useRouter } from 'next/router';

const db = getFirestore();

const Header = () => {
  const router = useRouter();
  const { locationId } = router.query;
  const [locationName, setLocationName] = useState(null);

  useEffect(() => {
    if (locationId) {
      const checkLocationExists = async () => {
        console.log("Checking existence for locationId:", locationId);

        const locationDocRef = doc(db, 'Locations', locationId);
        const locationDocSnapshot = await getDoc(locationDocRef);

        const locationData = locationDocSnapshot.data();
        if (!locationData || !locationData.location_name || !locationData.is_activated) {
          console.log("Location data, location_name does not exist, or is not activated, redirecting to 404");
          // router.push('/404');
        } else {
          setLocationName(locationData.location_name);
        }

      };

      checkLocationExists();
    }
  }, [locationId]);

  const [anchorEl, setAnchorEl] = useState(null);

  const handleLanguageIconClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLanguagePopoverClose = () => {
    setAnchorEl(null);
  };



  return (
    <Box
      sx={{
        backdropFilter: 'blur(6px)',
        backgroundColor: (theme) => alpha(theme.palette.background.default, 0.8),
        position: 'sticky',
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        padding: '8px 10px',
      }}
    >
      <Box
  sx={{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', 
    maxWidth: '1100px',
    margin: '0 auto',
  }}
      >
        {/* Orama text link */}
        <Logo  />

        {/* Display locationName or placeholder if not available */}
        <Box display="flex" alignItems="center" justifyContent="center" height="100%">
          <Typography variant="subtitle1" sx={{
            color: (theme) => theme.palette.text.primary,
            '&:hover': {
              color: (theme) => theme.palette.text.secondary,
              transition: '0.3s ease-in-out',
            },
          }}
          >
            {locationName || ''} 
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
    <IconButton onClick={handleLanguageIconClick}>
      <img src="/assets/flags/united-kingdom.png" alt="UK Flag" width={24} height={24} />
    </IconButton>

    <LanguagePopover
      anchorEl={anchorEl}
      onClose={handleLanguagePopoverClose}
      open={Boolean(anchorEl)}
    />

    <Link href="/" passHref>
      <IconButton sx={{ color: (theme) => theme.palette.text.primary, marginLeft: '8px' }}>
        <SvgIcon><HomeIcon /></SvgIcon>
      </IconButton>
    </Link>
  </Box>
      </Box>
    </Box>
  );
};


export default Header;
