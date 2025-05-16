import { Box, Typography, Paper, useTheme } from '@mui/material';
import type { TeamStats } from '../../types';

interface PointsTableProps {
    stats: TeamStats[];
}

export const PointsTable = ({ stats }: PointsTableProps) => {
    const theme = useTheme();

    const cellStyle = {
        padding: '16px',
        textAlign: 'center' as const,
        whiteSpace: 'nowrap' as const,
        color: '#1a1a1a',
        fontSize: '0.875rem'
    };

    const headerCellStyle = {
        ...cellStyle,
        fontWeight: 600,
        backgroundColor: '#001838',
        color: 'white',
        position: 'sticky' as const,
        top: 0,
        zIndex: 1
    };

    const getQualificationStyle = (index: number) => {
        if (index < 2) {
            return { borderLeft: '4px solid #4CAF50' }; // Qualified
        } else if (index === 2 || index === 3) {
            return { borderLeft: '4px solid #FF9800' }; // Playoffs
        }
        return {};
    };

    return (
        <Box sx={{ 
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'fixed',
            top: { xs: 64, md: 72 }, // Account for AppBar height
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: '#f5f5f5'
        }}>
            {/* Fixed Title */}
            <Box sx={{
                position: 'relative',
                zIndex: 2,
                bgcolor: '#f5f5f5',
                py: { xs: 2, sm: 3 },
                textAlign: 'center'
            }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600,
                        color: '#001838',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        fontSize: { xs: '1.125rem', sm: '1.25rem', md: '1.5rem' }
                    }}
                >
                    Points Table
                </Typography>
            </Box>

            {/* Scrollable Table Container */}
            <Box sx={{ 
                flex: 1,
                overflow: 'hidden',
                px: { xs: 1, sm: 2, md: 3 },
                pb: { xs: 2, sm: 3 }
            }}>
                <Box sx={{
                    height: '100%',
                    overflowX: 'auto',
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                        width: 8,
                        height: 8
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: '#f1f1f1'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#888',
                        borderRadius: 4,
                        '&:hover': {
                            backgroundColor: '#666'
                        }
                    }
                }}>
                    <Paper sx={{
                        display: 'inline-block',
                        minWidth: '900px',
                        width: '100%',
                        height: 'fit-content',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                        borderRadius: 2,
                    }}>
                        <Box
                            component="table"
                            sx={{
                                width: '100%',
                                borderCollapse: 'collapse'
                            }}
                        >
                            <Box component="thead">
                                <Box component="tr">
                                    <Box component="th" sx={{ ...headerCellStyle, textAlign: 'left', minWidth: '200px', paddingLeft: '20px' }}>Team</Box>
                                    <Box component="th" sx={headerCellStyle}>P</Box>
                                    <Box component="th" sx={headerCellStyle}>W</Box>
                                    <Box component="th" sx={headerCellStyle}>L</Box>
                                    <Box component="th" sx={headerCellStyle}>T</Box>
                                    <Box component="th" sx={headerCellStyle}>Pts</Box>
                                    <Box component="th" sx={headerCellStyle}>NRR</Box>
                                    <Box component="th" sx={{ ...headerCellStyle, minWidth: '150px' }}>Recent Form</Box>
                                </Box>
                            </Box>
                            <Box component="tbody">
                                {stats.map((stat, index) => (
                                    <Box
                                        component="tr"
                                        key={stat.team.id}
                                        sx={{
                                            backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa',
                                            borderBottom: '1px solid #e9ecef',
                                            transition: 'background-color 0.2s ease',
                                            ...getQualificationStyle(index),
                                            '&:hover': {
                                                backgroundColor: '#f5f5f5'
                                            }
                                        }}
                                    >
                                        <Box component="td" sx={{ ...cellStyle, textAlign: 'left', paddingLeft: '20px' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <Box
                                                    component="img"
                                                    src={stat.team.logo}
                                                    alt={stat.team.name}
                                                    sx={{
                                                        width: 40,
                                                        height: 40,
                                                        borderRadius: '50%',
                                                        border: '2px solid #e9ecef',
                                                        padding: '2px',
                                                        backgroundColor: 'white'
                                                    }}
                                                />
                                                <Box>
                                                    <Typography
                                                        sx={{
                                                            fontWeight: 600,
                                                            color: '#001838',
                                                            fontSize: '0.9rem',
                                                            maxWidth: '160px',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            whiteSpace: 'nowrap'
                                                        }}
                                                    >
                                                        {stat.team.name}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                        <Box component="td" sx={cellStyle}>{stat.matches}</Box>
                                        <Box component="td" sx={cellStyle}>{stat.wins}</Box>
                                        <Box component="td" sx={cellStyle}>{stat.losses}</Box>
                                        <Box component="td" sx={cellStyle}>{stat.ties}</Box>
                                        <Box component="td" sx={{ ...cellStyle, fontWeight: 600, color: '#001838' }}>{stat.points}</Box>
                                        <Box component="td" sx={cellStyle}>{stat.nrr?.toFixed(3) || '0.000'}</Box>
                                        <Box component="td" sx={cellStyle}>
                                            <Box sx={{
                                                display: 'flex',
                                                gap: 0.5,
                                                justifyContent: 'center',
                                                '& > div': {
                                                    transition: 'transform 0.2s ease',
                                                    '&:hover': {
                                                        transform: 'scale(1.1)'
                                                    }
                                                }
                                            }}>
                                                {stat.lastFive?.map((result, i) => (
                                                    <Box
                                                        key={i}
                                                        sx={{
                                                            width: 24,
                                                            height: 24,
                                                            borderRadius: '50%',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '0.75rem',
                                                            fontWeight: 600,
                                                            color: 'white',
                                                            bgcolor: result === 'W' ? '#4CAF50' :
                                                                result === 'L' ? '#f44336' : '#757575',
                                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                        }}
                                                    >
                                                        {result}
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            </Box>
        </Box>
    );
};