import { Box, Typography, Tab, Tabs, Container, Unstable_Grid2 as Grid } from '@mui/material';
import { Logo } from 'src/components/logo';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { TopNav } from './top-nav';
import SideNav from './side-nav';
import Footer from '../footer';

export const Layout = (props) => {
  const { children } = props;
  const router = useRouter();

  const [value, setValue] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (event, newValue) => {
    if(event) event.preventDefault();
    setValue(newValue);
  };
  
  return (
    <>
      <SideNav isOpen={isOpen} toggle={toggle} />
      <TopNav value={value} handleChange={handleChange} onNavOpen={toggle} />
      <Box >
        {children}
      </Box>
      <Footer />

    </>
  );
};
