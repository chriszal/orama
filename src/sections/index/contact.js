import React, { useRef, useState } from 'react';
import { Box, Typography, Container,Grid,TextField, Button, Snackbar, Alert } from '@mui/material';
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
    <Box id="contact" sx={{
      minHeight: ['auto', '860px'],
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}
  >
    <Container>
      <Grid container spacing={3} alignItems="center">
        {/* Text part */}
        <Grid item xs={12} md={6}>
        <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 2,mt:5 }}>
              Contact Us
            </Typography>
            <Typography variant="h4" sx={{ mb: 5, color: 'black' }}>
            Get in Touch
            </Typography>
            <Typography variant="body1" sx={{ mb: 5, color: 'black' }}>
            We'd love to hear from you! Whether you have questions, feedback, or just want to say hello, please fill out the form. We value your thoughts and opinions, so don't hesitate to reach out. We look forward to hearing from you!
            </Typography>
        </Grid>
      <Grid item xs={12} md={6}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          
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
          </Grid>
        </Grid>
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
