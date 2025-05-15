import React from 'react';
import { Box } from '@mui/material';
import { useParams, Navigate } from 'react-router-dom';
import { useTournamentContext } from '../context/TournamentContext';
import { MatchSummaryPage } from '../components/Matches/MatchSummaryPage';

export default function MatchSummaryView() {
    const { matchId } = useParams();
    const { tournament, handleUpdateMatch } = useTournamentContext();

    const match = tournament.matches.find(m => m.id === matchId);

    if (!match) {
        return <Navigate to="/schedule" replace />;
    }

    return (
        <Box>
            <MatchSummaryPage 
                match={match}
                onUpdateScores={() => {
                    // Navigate back after updating scores
                    window.history.back();
                }}
            />
        </Box>
    );
} 