import React, { useState } from 'react';
import { 
    AppBar, 
    Toolbar, 
    Typography, 
    Box, 
    Tabs, 
    Tab,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemText,
    useTheme,
    useMediaQuery
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';

const routes = [
    {path:"/",label:"Home"},
    { path: '/teams', label: 'Teams' },
    { path: '/schedule', label: 'Schedule' },
    { path: '/points-table', label: 'Points Table' },
    { path: '/knockout', label: 'Knockout' },
    { path: '/about', label: 'About' },
];

export function Header() {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const currentTab = routes.findIndex(route => route.path === location.pathname);

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        navigate(routes[newValue].path);
    };

    const handleMobileMenuClick = (path: string) => {
        navigate(path);
        setMobileMenuOpen(false);
    };

    const handleLogoClick = () => {
        navigate('/schedule');
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
                    py: 1,
                    justifyContent: 'space-between'
                }}
            >
                <Box 
                    sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2,
                        minWidth: 'fit-content',
                        flex: { xs: 1, md: 'unset' },
                        cursor: 'pointer'
                    }}
                    onClick={handleLogoClick}
                >
                    <Box 
                        component="img"
                        src={logo}
                        alt="RFCL25 Logo"
                        sx={{
                            height: { xs: '45px', md: '55px' },
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
                                borderRadius: '4px',
                                display: { xs: 'none', sm: 'block' }
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
                                display: { xs: 'none', sm: 'block' }
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
                                fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.5rem' },
                                letterSpacing: '0.02em',
                                lineHeight: 1.2,
                                background: 'linear-gradient(45deg, #FF8C00, #FFA500)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                textShadow: '2px 2px 4px rgba(255,140,0,0.2)',
                                transform: { xs: 'none', md: 'perspective(500px) rotateX(10deg)' },
                                animation: { xs: 'none', md: 'titleFloat 3s ease-in-out infinite' },
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
                                fontSize: { xs: '0.9rem', sm: '1rem', md: '1.1rem' },
                                letterSpacing: '0.15em',
                                lineHeight: 1,
                                color: 'rgba(255,255,255,0.95)',
                                textTransform: 'uppercase',
                                marginTop: '2px',
                                background: 'linear-gradient(45deg, #FFFFFF 30%, #E0E0E0 90%)',
                                backgroundClip: 'text',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                animation: { xs: 'none', md: 'subtitleGlow 3s ease-in-out infinite' },
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

                {!isMobile && (
                    <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
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
                                        minWidth: 120,
                                        px: 2,
                                        fontWeight: 500
                                    }}
                                />
                            ))}
                        </Tabs>
                    </Box>
                )}

                {isMobile && (
                    <IconButton
                        edge="end"
                        color="inherit"
                        aria-label="menu"
                        onClick={() => setMobileMenuOpen(true)}
                        sx={{
                            color: '#FF8C00',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 140, 0, 0.1)'
                            }
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                )}

                <Drawer
                    anchor="right"
                    open={mobileMenuOpen}
                    onClose={() => setMobileMenuOpen(false)}
                    PaperProps={{
                        sx: {
                            width: 240,
                            background: 'linear-gradient(135deg, #001838 0%, #002147 100%)',
                            color: 'white',
                            marginTop: '64px'
                        }
                    }}
                >
                    <List sx={{ pt: 2 }}>
                        {routes.map((route) => (
                            <ListItem
                                key={route.path}
                                onClick={() => handleMobileMenuClick(route.path)}
                                sx={{
                                    py: 2,
                                    borderLeft: route.path === location.pathname ? '4px solid #FF8C00' : '4px solid transparent',
                                    backgroundColor: route.path === location.pathname ? 'rgba(255, 140, 0, 0.1)' : 'transparent',
                                    '&:hover': {
                                        backgroundColor: 'rgba(255, 140, 0, 0.1)',
                                        cursor: 'pointer'
                                    }
                                }}
                            >
                                <ListItemText 
                                    primary={route.label}
                                    sx={{
                                        '& .MuiListItemText-primary': {
                                            color: route.path === location.pathname ? '#FF8C00' : 'white',
                                            fontWeight: route.path === location.pathname ? 600 : 400
                                        }
                                    }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            </Toolbar>
        </AppBar>
    );
} 