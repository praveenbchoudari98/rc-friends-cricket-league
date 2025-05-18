import React from 'react';
import { Box } from '@mui/material';
import KnockoutStage from '../components/Tournament/KnockoutStage';
import { useTournamentContext } from '../context/TournamentContext';
import { MatchType } from '../types';

export default function KnockoutView() {
    const { tournament, handleUpdateMatch } = useTournamentContext();

    return (
        <Box sx={{ minHeight: 'calc(100vh - 180px)' }}>
            <KnockoutStage 
                matches={tournament.matches}
                pointsTable={tournament.pointsTable}
                onMatchUpdate={handleUpdateMatch}
                currentStage={tournament.currentStage}
            />
        </Box>
    );
} 