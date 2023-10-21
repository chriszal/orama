import { Box, Typography, Container, Grid } from '@mui/material';

const About = () => {
  return (
    <Box
      id="about"
      sx={{
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
              About Us
            </Typography>
            <Typography variant="h4" sx={{ mb: 5 }}>
            What is Orama?
            </Typography>
            <Typography variant="body1" sx={{ mb: 5}}>
            Orama is a project developed by two Greek University students that aims to create a collection of images showing the changes in different locations. Simply scan the QR code on one of our phone stands, take a photo, and share your perspective with the world. Together, we can create a unique and dynamic view of the world&apos;s most beautiful locations. Whether it&apos;s a beach, a city, a forest, or any other location, we want to capture its beauty, traffic and changes through the eyes of the world and with the help of the community.
            </Typography>
          </Grid>
          {/* Illustration part */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 3,
              }}
            >
              <img
                alt="Server Issue"
                src="/assets/about-us.png"
                style={{
                  display: 'block',
                  maxWidth: '100%',
                  width: 'auto', 
                  height: 'auto', 
                  maxHeight: '500px'
                }}
              />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default About;
