import { Box, Typography, Link as MuiLink } from '@mui/material';
import Link from 'next/link';

const Header = () => {
  return (
    <Box sx={{ backgroundColor: 'neutral.800', padding: '8px 24px' }}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          maxWidth: '1100px',
          margin: '0 auto'
        }}
      >
        <Link href="/"  style={{textDecoration:'none'}} passHref>
          <MuiLink
            sx={{
              color: '#fff',
              fontSize: '2rem',
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
      </Box>
    </Box>
  );
};

export default Header;
