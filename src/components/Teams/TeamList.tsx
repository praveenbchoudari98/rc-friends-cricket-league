import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Paper,
    Grid as MuiGrid,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Team } from '../../types';

interface TeamListProps {
    teams: Team[];
    onRemoveTeam: (id: string) => void;
}

const Grid = MuiGrid as any; // Temporary type assertion to fix Grid issues

export const TeamList = ({ teams, onRemoveTeam }: TeamListProps) => {
    const [newTeamId, setNewTeamId] = useState<string | null>(null);
    const [initialTeamIds] = useState(new Set(teams.map(team => team.id)));

    useEffect(() => {
        if (teams.length > 0) {
            const latestTeam = teams[teams.length - 1];
            // Only set newTeamId if this team wasn't in the initial set
            if (!initialTeamIds.has(latestTeam.id)) {
                setNewTeamId(latestTeam.id);
                const timer = setTimeout(() => setNewTeamId(null), 1500);
                return () => clearTimeout(timer);
            }
        }
    }, [teams, initialTeamIds]);

    if (teams.length === 0) return null;

    return (
        <Box sx={{ mt: 4 }}>
            <Typography
                variant="h5"
                sx={{
                    textAlign: 'center',
                    color: '#424242',
                    fontWeight: 600,
                    mb: 3
                }}
            >
                Registered Teams
            </Typography>

            <Box sx={{ px: 2 }}>
                <Grid container spacing={2}>
                    {teams.map((team) => (
                        <Grid item xs={12} sm={6} md={4} key={team.id}>
                            <Paper
                                elevation={0}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    p: 2,
                                    borderRadius: 2,
                                    border: '1px solid rgba(255, 140, 0, 0.1)',
                                    background: '#FFFFFF',
                                    transition: 'all 0.3s ease-in-out',
                                    opacity: initialTeamIds.has(team.id) ? 1 : 0,
                                    transformOrigin: 'top center',
                                    animation: team.id === newTeamId ? 
                                        'blurIn 0.8s ease-out forwards' : 
                                        (!initialTeamIds.has(team.id) ? 'fadeIn 0.4s ease-out forwards' : 'none'),
                                    '@keyframes blurIn': {
                                        '0%': {
                                            opacity: 0,
                                            transform: 'translateY(-10px)',
                                            filter: 'blur(10px)'
                                        },
                                        '50%': {
                                            opacity: 0.8,
                                            transform: 'translateY(-5px)',
                                            filter: 'blur(5px)'
                                        },
                                        '100%': {
                                            opacity: 1,
                                            transform: 'translateY(0)',
                                            filter: 'blur(0px)'
                                        }
                                    },
                                    '@keyframes fadeIn': {
                                        '0%': {
                                            transform: 'translateY(-10px)',
                                            opacity: 0,
                                            filter: 'blur(5px)'
                                        },
                                        '100%': {
                                            transform: 'translateY(0)',
                                            opacity: 1,
                                            filter: 'blur(0px)'
                                        }
                                    },
                                    '&:hover': {
                                        boxShadow: '0 4px 20px rgba(255, 140, 0, 0.15)',
                                        transform: 'translateY(-4px)',
                                    },
                                    position: 'relative',
                                    zIndex: team.id === newTeamId ? 100 : 1,
                                    backdropFilter: team.id === newTeamId ? 'blur(4px)' : 'none',
                                    boxShadow: team.id === newTeamId ? 
                                        '0 8px 32px rgba(255, 140, 0, 0.2)' : 
                                        'none'
                                }}
                            >
                                <Box
                                    component="img"
                                    src={team.logo}
                                    alt={team.name}
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        borderRadius: '50%',
                                        border: '3px solid #FF8C00',
                                        p: 0.5,
                                        bgcolor: 'white',
                                        flexShrink: 0,
                                        transition: 'all 0.3s ease-in-out',
                                        '&:hover': {
                                            transform: 'scale(1.1)',
                                            boxShadow: '0 4px 20px rgba(255, 140, 0, 0.2)'
                                        }
                                    }}
                                />
                                <Box
                                    sx={{
                                        flex: 1,
                                        background: `
                                            repeating-linear-gradient(
                                                #FFFFFF,
                                                #FFFFFF 29px,
                                                #E5E5E5 29px,
                                                #E5E5E5 30px
                                            )
                                        `,
                                        p: 1,
                                        borderRadius: 1,
                                        position: 'relative',
                                        '&::before': {
                                            content: '""',
                                            position: 'absolute',
                                            top: 0,
                                            left: -10,
                                            width: 20,
                                            height: '100%',
                                            background: 'linear-gradient(90deg, transparent, #FF8C00, transparent)',
                                            opacity: 0.1
                                        }
                                    }}
                                >
                                    <Typography 
                                        variant="subtitle1" 
                                        sx={{ 
                                            fontWeight: 500,
                                            color: '#424242',
                                            textAlign: 'center',
                                            lineHeight: '30px',
                                            fontSize: '1.1rem'
                                        }}
                                    >
                                        {team.name}
                                    </Typography>
                                </Box>
                                <IconButton
                                    onClick={() => onRemoveTeam(team.id)}
                                    size="small"
                                    sx={{
                                        color: '#FF8C00',
                                        '&:hover': {
                                            color: '#CC7000',
                                            bgcolor: 'rgba(255, 140, 0, 0.1)'
                                        }
                                    }}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}; 