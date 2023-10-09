import Head from 'next/head';
import { Box, Typography, Button, Container, TextField } from '@mui/material';
import { Layout as LocationsLayout } from 'src/layouts/locations/layout';
import { Logo } from 'src/components/logo';
import Link from 'next/link';
import Hero from 'src/sections/index/hero';
import About from 'src/sections/index/about';
import Contact from 'src/sections/index/contact';
import Locations from 'src/sections/index/locations';

const Page = () => {
  return (
    <>
      <Head>
        <title>Beam</title>
      </Head>

      
    </>
  );
};

Page.getLayout = (page) => <LocationsLayout>{page}</LocationsLayout>;

export default Page;