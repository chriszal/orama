import { Box, Typography, Tab, Tabs, Container, Unstable_Grid2 as Grid } from '@mui/material';
import Footer from '../footer';
import Header from './header';

export const Layout = (props) => {
  const { children } = props;
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header /> 
      <Box sx={{ flex: '1', overflow: 'auto' }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};
