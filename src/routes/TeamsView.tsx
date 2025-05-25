import React from 'react';
import { Box } from '@mui/material';
import { TeamForm } from '../components/Teams/TeamForm';
import { TeamList } from '../components/Teams/TeamList';
import TeamsDisabledState from '../components/Teams/TeamsDisabledState';
import { CompletedTournamentView } from '../components/Tournament/CompletedTournamentView';
import { useTournamentContext } from '../context/TournamentContext';

export default function TeamsView() {
    const { tournament, handleAddTeam, handleRemoveTeam, handleResetTeams, handleContinueWithTeams } = useTournamentContext();
    const winner = tournament.matches.find(m => m.matchType === 'final')?.result?.winner;

    return (
        <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 3,
            position: 'relative',
            minHeight: 'calc(100vh - 180px)',
        }}>
            {tournament.status === 'completed' ? (
                <CompletedTournamentView
                    winner={winner}
                    onResetTeams={handleResetTeams}
                    onContinueWithTeams={handleContinueWithTeams}
                />
            ) : tournament.status === 'upcoming' ? (
                <>
                    <TeamForm 
                        onSubmit={handleAddTeam} 
                        teams={tournament.teams}
                    />
                    <TeamList 
                        teams={tournament.teamDetails} 
                        onRemoveTeam={handleRemoveTeam}
                    />
                </>
            ) : (
                <TeamsDisabledState teams={tournament.teams} />
            )}
        </Box>
    );
} 