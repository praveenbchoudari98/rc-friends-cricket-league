import React from 'react';
import { Box } from '@mui/material';
import { About } from '../components/About/About';

export default function AboutView() {
    return (
        <Box sx={{ minHeight: 'calc(100vh - 180px)' }}>
            <About />
        </Box>
    );
} 