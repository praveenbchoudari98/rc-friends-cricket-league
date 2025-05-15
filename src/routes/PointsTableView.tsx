import React from 'react';
import { Box } from '@mui/material';
import { PointsTable } from '../components/Tournament/PointsTable';
import { useTournamentContext } from '../context/TournamentContext';

export default function PointsTableView() {
    const { tournament } = useTournamentContext();

    if (tournament.pointsTable.length === 0) {
        return null;
    }

    return (
        <Box sx={{ minHeight: 'calc(100vh - 180px)' }}>
            <PointsTable stats={tournament.pointsTable} />
        </Box>
    );
} 