import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import PropTypes from 'prop-types';
import { Box, Divider, MenuItem, MenuList, Popover, Typography } from '@mui/material';

export const LanguagePopover = (props) => {
    const { anchorEl, onClose, open } = props;
    const router = useRouter();
  
    const handleLanguageChange = (lang) => {
      // Handle the logic to change the language here if needed.
      onClose();
    };
  
    return (
      <Popover
        anchorEl={anchorEl}
        anchorOrigin={{
          horizontal: 'left',
          vertical: 'bottom'
        }}
        onClose={onClose}
        open={open}
        PaperProps={{ sx: { width: 200 } }}
      >
        <MenuList
          disablePadding
          dense
          sx={{
            p: '8px',
            '& > *': {
              borderRadius: 1
            }
          }}
        >
          <MenuItem onClick={() => handleLanguageChange('en')}>
            <img src="/assets/flags/united-kingdom.png" alt="UK Flag" width={24} height={24} />
            <Typography sx={{ ml: 2 }}>English</Typography>
          </MenuItem>
          <MenuItem onClick={() => handleLanguageChange('gr')}>
            <img src="/assets/flags/greece.png" alt="Greek Flag" width={24} height={24} />
            <Typography sx={{ ml: 2 }}>Greek</Typography>
          </MenuItem>
        </MenuList>
      </Popover>
    );
  };

LanguagePopover.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  open: PropTypes.bool.isRequired
};