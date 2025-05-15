import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { Schedule } from '../components/Tournament/Schedule';
import { useTournamentContext } from '../context/TournamentContext';

export default function ScheduleView() {
    const { 
        tournament, 
        handleUpdateMatch, 
        handleStartTournament,
        handleCreatePlayoffMatch 
    } = useTournamentContext();

    useEffect(() => {
        // Check if there's a match ID in session storage for updating
        const updateMatchId = sessionStorage.getItem('updateMatchId');
        if (updateMatchId) {
            // Find the match and trigger the update dialog
            const match = tournament.matches.find(m => m.id === updateMatchId);
            if (match) {
                // We'll need to implement a way to trigger the update dialog
                // This could be done by passing a prop to Schedule component
                sessionStorage.removeItem('updateMatchId');
            }
        }
    }, [tournament.matches]);

    return (
        <Box sx={{ minHeight: 'calc(100vh - 180px)' }}>
            <Schedule 
                matches={tournament.matches}
                teams={tournament.teams}
                onMatchUpdate={handleUpdateMatch}
                onStartTournament={handleStartTournament}
                canStartTournament={tournament.status === 'upcoming' && tournament.teams.length >= 2}
                currentStage={tournament.currentStage}
                onCreatePlayoffMatch={handleCreatePlayoffMatch}
                updateMatchId={sessionStorage.getItem('updateMatchId')}
            />
        </Box>
    );
} 