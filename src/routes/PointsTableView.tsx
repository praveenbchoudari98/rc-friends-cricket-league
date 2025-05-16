import React from 'react';
import { Box } from '@mui/material';
import { PointsTable } from '../components/Tournament/PointsTable';
import { useTournamentContext } from '../context/TournamentContext';
import RestoreFirestore from '../components/FirebaseUploader';

export default function PointsTableView() {
    const { tournament } = useTournamentContext();

    const isProduction = process.env.NODE_ENV === 'production';
    if (tournament.pointsTable.length === 0) {
        return !isProduction && <RestoreFirestore />;
    }

    return (
        <Box sx={{ minHeight: 'calc(100vh - 180px)' }}>
            <PointsTable stats={tournament.pointsTable} />
        </Box>
    );
} 