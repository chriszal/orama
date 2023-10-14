import { Box, Typography, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import { alpha } from '@mui/material/styles';

const Header = () => {
  return (
    <Box
      sx={{
        backdropFilter: 'blur(6px)',
        backgroundColor: (theme) => alpha(theme.palette.text.primary, 0.8),
        position: 'sticky',
        top: 0,
        zIndex: (theme) => theme.zIndex.appBar,
        padding: '8px 24px',
      }}
    >
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
