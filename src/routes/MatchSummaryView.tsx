import React from 'react';
import { Box } from '@mui/material';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { MatchSummaryPage } from '../components/Matches/MatchSummaryPage';
import { useTournamentContext } from '../context/TournamentContext';

export default function MatchSummaryView() {
    const { matchId } = useParams();
    const { tournament, handleUpdateMatch } = useTournamentContext();
    const navigate = useNavigate();

    const match = tournament.matches.find(m => m.id === matchId);

    if (!match) {
        return <Navigate to="/schedule" replace />;
    }

    const handleUpdateScores = () => {
        // Store the match ID in session storage to trigger the update dialog
        sessionStorage.setItem('updateMatchId', matchId!);
        // Navigate back to schedule where the update dialog will be shown
        navigate('/schedule');
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