import { Box, Typography, Paper } from '@mui/material';
import type { TeamStats } from '../../types';

interface PointsTableProps {
    stats: TeamStats[];
}

export const PointsTable = ({ stats }: PointsTableProps) => {
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
        <Box>
            <Typography 
                variant="h5" 
                sx={{ 
                    mb: 4,
                    fontWeight: 600,
                    color: '#001838',
                    textAlign: 'center',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                }}
            >
                Points Table
            </Typography>
            <Paper 
                sx={{ 
                    overflowX: 'auto', 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    borderRadius: 2,
                    '&::-webkit-scrollbar': {
                        height: 8
                    },
                    '&::-webkit-scrollbar-track': {
                        backgroundColor: '#f1f1f1'
                    },
                    '&::-webkit-scrollbar-thumb': {
                        backgroundColor: '#888',
                        borderRadius: 4
                    }
                }}
            >
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ ...headerCellStyle, textAlign: 'left', minWidth: '200px' }}>Team</th>
                            <th style={headerCellStyle}>P</th>
                            <th style={headerCellStyle}>W</th>
                            <th style={headerCellStyle}>L</th>
                            <th style={headerCellStyle}>T</th>
                            <th style={headerCellStyle}>Pts</th>
                            <th style={headerCellStyle}>NRR</th>
                            <th style={headerCellStyle}>Form</th>
                        </tr>
                    </thead>
                    <tbody>
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
                                <td style={{ ...cellStyle, textAlign: 'left', paddingLeft: '20px' }}>
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
                                                padding: '4px',
                                                backgroundColor: 'white'
                                            }}
                                        />
                                        <Box>
                                            <Typography 
                                                sx={{ 
                                                    fontWeight: 600,
                                                    color: '#001838',
                                                    fontSize: '0.9rem'
                                                }}
                                            >
                                                {stat.team.name}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </td>
                                <td style={cellStyle}>{stat.matches}</td>
                                <td style={cellStyle}>{stat.wins}</td>
                                <td style={cellStyle}>{stat.losses}</td>
                                <td style={cellStyle}>{stat.ties}</td>
                                <td style={{ ...cellStyle, fontWeight: 600, color: '#001838' }}>{stat.points}</td>
                                <td style={cellStyle}>{stat.nrr?.toFixed(3) || '0.000'}</td>
                                <td style={cellStyle}>
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
                                        {stat.lastFive.map((result, i) => (
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
                                </td>
                            </Box>
                        ))}
                    </tbody>
                </table>
            </Paper>
        </Box>
    );
}; 