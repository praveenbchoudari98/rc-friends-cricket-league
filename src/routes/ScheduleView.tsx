import React from 'react';
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
            />
        </Box>
    );
} 