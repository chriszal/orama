import { Box, Typography, Button, Container } from '@mui/material';
import Link from 'next/link';
import ChevronRightIcon from '@heroicons/react/24/solid/ChevronRightIcon';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import React, { useState } from 'react';
import { GradientCanvas } from 'src/components/gradient-canvas';


const Hero = () => {
    const [hover, setHover] = useState(false);

    const onHover = () => {
        setHover(!hover)
    }
    return (
        <>
        <GradientCanvas />

        <Box id="hero" sx={{ display: 'flex', alignItems: 'center', height: '860px', justifyContent: 'center', flexGrow: 1 }}>
            <Container>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' , mt:-36}}>
                <Typography variant="h2" sx={{  fontWeight: 'bold', position: 'relative' }}>
                        Discover the world through time
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 1, fontWeight: 'normal', color: 'text.secondary' }}>
                        Join the movement and capture the beauty of change
                    </Typography>
                    <Button
                        component={Link}
                        href="/auth/login"
                        variant="contained"
                        sx={{
                            mt: 5,
                            borderRadius: '40px',
                            minWidth: '180px', 
                            whiteSpace: 'nowrap' 
                        }}
                        onMouseEnter={onHover}
                        onMouseLeave={onHover}
                    >
                        Find Locations&nbsp;
                        {hover ? <ArrowRightIcon style={{ display: 'inline' }} /> : <ChevronRightIcon style={{ display: 'inline' }} />}
                    </Button>

                </Box>
            </Container>
        </Box>
        </>
    );
};

export default Hero;
