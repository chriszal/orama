import { Box, Typography, Button, Container } from '@mui/material';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

import ChevronRightIcon from '@heroicons/react/24/solid/ChevronRightIcon';
import ArrowRightIcon from '@heroicons/react/24/solid/ArrowRightIcon';
import React, { useState } from 'react';
import { GradientCanvas } from 'src/components/gradient-canvas';
import { Link as ScrollLink } from 'react-scroll';

const Hero = () => {
    const [hover, setHover] = useState(false);
    const heroRef = useRef(null);
    const onHover = () => {
        setHover(!hover)
    }
    return (
        <>
            <GradientCanvas parentRef={heroRef}/>
            <Box 
    id="hero" 
    sx={{ 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: ['100vh', '860px'],  
    }}
>

    <Container>
        <Box 
            ref={heroRef}  
            sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center', 
                justifyContent: 'center',
                textAlign: 'center'
            }}
        >
                        <Typography variant="h2" sx={{ fontWeight: 'bold', position: 'relative' }}>
                            Discover the world through time
                        </Typography>
                        <Typography variant="h6" sx={{ mt: 1, fontWeight: 'normal', color: 'text.secondary' }}>
                            Join the movement and capture the beauty of change
                        </Typography>
                        <ScrollLink
                            to="locations"
                            smooth={true}
                            duration={500}
                            offset={-80}
                        >
                            <Button
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
                        </ScrollLink>

                    </Box>
                </Container>
            </Box>
        </>
    );
};

export default Hero;
