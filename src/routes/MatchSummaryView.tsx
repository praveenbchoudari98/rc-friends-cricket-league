import React from 'react';
import { Box } from '@mui/material';
import { useParams, Navigate } from 'react-router-dom';
import { MatchSummaryPage } from '../components/Matches/MatchSummaryPage';
import { useTournamentContext } from '../context/TournamentContext';

export default function MatchSummaryView() {
    const { matchId } = useParams();
    const { tournament, handleUpdateMatch } = useTournamentContext();

    const match = tournament.matches.find(m => m.id === matchId);

    if (!match) {
        return <Navigate to="/schedule" replace />;
    }

    const handleUpdateScores = () => {
        // Navigate back to schedule and then trigger the update dialog
        // We'll implement this functionality in the next step
    };

    return (
        <Box>
            <MatchSummaryPage 
                match={match}
                onUpdateScores={handleUpdateScores}
            />
        </Box>
    );
} 