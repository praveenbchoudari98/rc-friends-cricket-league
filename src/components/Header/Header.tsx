import React from 'react';
import { AppBar, Toolbar, Typography, Box, Tabs, Tab } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';

const routes = [
    { path: '/', label: 'Teams' },
    { path: '/schedule', label: 'Schedule' },
    { path: '/points-table', label: 'Points Table' },
    { path: '/knockout', label: 'Knockout' },
    { path: '/about', label: 'About' },
];

export function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const currentTab = routes.findIndex(route => route.path === location.pathname);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        navigate(routes[newValue].path);
    };

    return (
        <AppBar 
            position="fixed" 
            sx={{ 
                zIndex: (theme) => theme.zIndex.drawer + 1,
                background: 'linear-gradient(135deg, #001838 0%, #002147 100%)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
        >
            <Toolbar 
                sx={{ 
                    display: 'flex', 
                    gap: 2,
                    minHeight: '72px !important',
                    py: 1
                }}
            >
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 3,
                    minWidth: 'fit-content',
                    mr: 4
                }}>
                    <Box 
                        component="img"
                        src={logo}
                        alt="RFCL25 Logo"
                        sx={{
                            height: '55px',
                            width: 'auto',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.05)'
                            }
                        }}
                    />
                    <Box 
                        sx={{ 
                            display: { xs: 'none', md: 'block' },
                            position: 'relative',
                            padding: '0.5rem 0',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                top: 0,
                                left: -8,
                                width: '3px',
                                height: '100%',
                                background: 'linear-gradient(180deg, #FF8C00, transparent)',
                                borderRadius: '4px'
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                bottom: -2,
                                left: 0,
                                width: '100%',
                                height: '2px',
                                background: 'linear-gradient(90deg, transparent, #FF8C00, transparent)',
                                animation: 'shimmer 2s infinite',
                            },
                            '@keyframes shimmer': {
                                '0%': { opacity: 0.4 },
                                '50%': { opacity: 1 },
                                '100%': { opacity: 0.4 }
                            }
                        }}
                    >
                <Typography 
                    variant="h6" 
                            sx={{ 
                                fontFamily: "'Playfair Display', serif",
                                fontStyle: 'italic',
                                fontWeight: 700,
                                fontSize: '1.5rem',
                                letterSpacing: '0.02em',
                                lineHeight: 1.2,
                                background: 'linear-gradient(45deg, #FF8C00, #FFA500)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: '2px 2px 4px rgba(255,140,0,0.2)',
                                transform: 'perspective(500px) rotateX(10deg)',
                                animation: 'titleFloat 3s ease-in-out infinite',
                                '@keyframes titleFloat': {
                                    '0%, 100%': { transform: 'perspective(500px) rotateX(10deg)' },
                                    '50%': { transform: 'perspective(500px) rotateX(5deg)' }
                                }
                            }}
                        >
                            RC Friends
                        </Typography>
                        <Typography 
                            variant="subtitle1" 
                    sx={{ 
                                fontFamily: "'Cormorant Garamond', serif",
                                fontStyle: 'italic',
                                fontWeight: 500,
                                fontSize: '1.1rem',
                                letterSpacing: '0.15em',
                                lineHeight: 1,
                                color: 'rgba(255,255,255,0.95)',
                                textTransform: 'uppercase',
                                marginTop: '2px',
                                background: 'linear-gradient(45deg, #FFFFFF 30%, #E0E0E0 90%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                animation: 'subtitleGlow 3s ease-in-out infinite',
                                '@keyframes subtitleGlow': {
                                    '0%, 100%': { filter: 'brightness(100%) blur(0)' },
                                    '50%': { filter: 'brightness(120%) blur(0.2px)' }
                                }
                    }}
                >
                            Cricket League
                </Typography>
                    </Box>
                </Box>

                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    <Tabs 
                        value={currentTab} 
                        onChange={handleTabChange}
                        textColor="inherit"
                        sx={{
                            '& .MuiTab-root': {
                                color: '#FFF',
                                opacity: 0.7,
                                '&.Mui-selected': {
                                    color: '#FF8C00',
                                    opacity: 1
                                }
                            },
                            '& .MuiTabs-indicator': {
                                backgroundColor: '#FF8C00'
                            }
                        }}
                    >
                        {routes.map((route) => (
                            <Tab 
                                key={route.path}
                                label={route.label}
                                sx={{ 
                                    minWidth: { xs: 'auto', sm: 120 },
                                    px: { xs: 1, sm: 2 },
                                    fontWeight: 500
                                }}
                            />
                        ))}
                    </Tabs>
                </Box>
            </Toolbar>
        </AppBar>
    );
} 