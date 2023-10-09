import { Box, Typography, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaYoutube, FaTwitter, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  return (
    <Box sx={{ backgroundColor: 'neutral.800', }}>
      <Box
        sx={{
          padding: '8px 24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '1100px',
          margin: '0 auto'
        }}
      >
        <Box sx={{ maxWidth: '1000px', width: '100%' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              maxWidth: '1100px',
              margin: '20px auto 0 auto',
              flexDirection: { xs: 'column', sm: 'row' }
            }}
          >
            <Link href="/" style={{textDecoration:'none'}} passHref>
              <MuiLink
                sx={{
                  color: '#fff',
                  fontSize: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  marginBottom: '16px',
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  '&:hover': {
                    color: '#01bf71',
                    transition: '0.3s ease-in-out'
                  }
                }}
              >
                Orama
              </MuiLink>
            </Link>
            <Typography variant="body2" sx={{ color: '#fff', marginBottom: '16px' }}>
              Orama © {new Date().getFullYear()} All rights reserved.
            </Typography>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '120px'
              }}
            >
              <MuiLink href="/" target="_blank" aria-label="Facebook" sx={{ color: '#fff', fontSize: '24px' }}>
                <FaFacebook />
              </MuiLink>
              <MuiLink href="/" target="_blank" aria-label="Instagram" sx={{ color: '#fff', fontSize: '24px' }}>
                <FaInstagram />
              </MuiLink>
              <MuiLink href="/" target="_blank" aria-label="Twitter" sx={{ color: '#fff', fontSize: '24px' }}>
                <FaTwitter />
              </MuiLink>
              <MuiLink href="/" target="_blank" aria-label="TikTok" sx={{ color: '#fff', fontSize: '24px' }}>
                <FaTiktok />
              </MuiLink>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Footer;
