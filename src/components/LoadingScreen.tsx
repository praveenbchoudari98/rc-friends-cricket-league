import React from 'react';
import { Box, CircularProgress, Typography, Container } from '@mui/material';

export const LoadingScreen: React.FC = () => {
    return (
        <Container maxWidth={false} disableGutters sx={{ height: '100vh' }}>
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'background.default',
                    zIndex: 9999
                }}
            >
                <CircularProgress 
                    size={60} 
                    thickness={4} 
                    sx={{ 
                        color: 'primary.main',
                        mb: 2
                    }} 
                />
                <Typography 
                    variant="h6" 
                    color="text.secondary"
                    sx={{
                        fontWeight: 500,
                        letterSpacing: '0.5px'
                    }}
                >
                    Loading Tournament...
                </Typography>
            </Box>
        </Container>
    );
}; 