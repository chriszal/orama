import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';

export default function ResponsiveDialog(props) {
    const { open, onClose, title, message, actions } = props;
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Dialog
      open={open}
      onClose={(event, reason) => {
        if (reason === 'backdropClick') {
          console.log("Backdrop Click - Should not close!");
          return;  
        }
        onClose();
      }}
      aria-labelledby="responsive-dialog-title"
      disableBackdropClick
    >
      {title && <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>}
      {message && <DialogContent><DialogContentText>{message}</DialogContentText></DialogContent>}
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
}