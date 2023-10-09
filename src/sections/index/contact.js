import React, { useRef, useState } from 'react';
import { Box, Typography, Container, TextField, Button, Snackbar, Alert } from '@mui/material';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const form = useRef();
  const [isSent, setIsSent] = useState(false);  
  const [isError, setIsError] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs.sendForm(
      process.env.NEXT_PUBLIC_REACT_APP_EMAIL_JS_ID,
      process.env.NEXT_PUBLIC_REACT_APP_EMAIL_JS_TEMPLATE,
      form.current,
      process.env.NEXT_PUBLIC_REACT_APP_EMAIL_JS_PUBLIC_KEY
    )
    .then((result) => {
        console.log(result.text);
        if(result.text === "OK"){
          form.current.reset();
          setIsSent(true);
        } else {
          setIsError(true);
        }
    }, (error) => {
        console.log(error.text);
        setIsError(true);
    });
  };

  const handleClose = () => {
    setIsSent(false);
    setIsError(false);
  };

  return (
    <Box id="contact" sx={{ display: 'flex', alignItems: 'center',height: '860px', justifyContent: 'center', flexGrow: 1 }}>
      <Container maxWidth="md">
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Typography variant="h3" sx={{ mt: 3 }}>
            Contact Us
          </Typography>
          <Box 
            component="form"
            sx={{ mt: 5 }}
            ref={form}
            onSubmit={sendEmail}
          >
            <TextField label="Name" fullWidth sx={{ mb: 3 }} name="user_name" required />
            <TextField label="Email" fullWidth sx={{ mb: 3 }} name="user_email" required />
            <TextField label="Message" multiline rows={4} fullWidth sx={{ mb: 3 }} name="message" required />
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Box>
        </Box>
      </Container>
      <Snackbar open={isSent} autoHideDuration={5000} onClose={handleClose} message="Email sent successfully">
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          Email sent successfully
        </Alert>
      </Snackbar>
      <Snackbar open={isError} autoHideDuration={5000} onClose={handleClose} message="Email failed to send">
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          Email failed to send
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Contact;
