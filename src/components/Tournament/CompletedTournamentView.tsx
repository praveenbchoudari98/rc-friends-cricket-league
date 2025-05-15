import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Team } from '../../types';

interface CompletedTournamentViewProps {
    winner?: Team;
    onResetTeams: () => void;
    onContinueWithTeams: () => void;
}

export function CompletedTournamentView({ 
    winner,
    onResetTeams,
    onContinueWithTeams 
}: CompletedTournamentViewProps) {
    return (
        <Box 
            sx={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                py: 4,
                textAlign: 'center'
            }}
        >
            <Typography 
                variant="h4" 
                sx={{ 
                    color: '#FF8C00',
                    fontWeight: 700,
                    mb: 2
                }}
            >
                Tournament Complete!
            </Typography>
            
            {winner && (
                <Typography 
                    variant="h5" 
                    sx={{ 
                        color: '#001838',
                        mb: 3
                    }}
                >
                    Congratulations to {winner.name}!
                </Typography>
            )}

            <Typography 
                variant="body1" 
                sx={{ 
                    color: '#666',
                    mb: 4,
                    maxWidth: 600
                }}
            >
                Would you like to start a new tournament with the same teams or create a fresh tournament with new teams?
            </Typography>

            <Box 
                sx={{ 
                    display: 'flex',
                    gap: 3,
                    justifyContent: 'center',
                    width: '100%',
                    maxWidth: 600
                }}
            >
                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={onResetTeams}
                    sx={{ 
                        py: 2,
                        px: 4,
                        flex: 1
                    }}
                >
                    New Teams
                </Button>
                <Button
                    variant="contained"
                    onClick={onContinueWithTeams}
                    sx={{ 
                        py: 2,
                        px: 4,
                        flex: 1
                    }}
                >
                    Keep Same Teams
                </Button>
            </Box>
        </Box>
    );
} 