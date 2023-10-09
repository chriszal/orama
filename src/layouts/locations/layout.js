import { Box, Typography, Tab, Tabs, Container, Unstable_Grid2 as Grid } from '@mui/material';
import Footer from '../footer';

export const Layout = (props) => {
  const { children } = props;
  return (
    <>
      <Box >
        {children}
      </Box>
      <Footer />

    </>
  );
};
