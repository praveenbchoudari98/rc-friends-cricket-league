import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Container,
    Tabs,
    Tab,
    Paper
} from '@mui/material';
import { format } from 'date-fns';
import type { Match, MatchResult, Team, MatchType, TournamentStage } from '../../types';
import { MatchCard } from '../Matches/MatchCard';
import { TournamentStartModal } from './TournamentStartModal';
import { PlayoffBracket } from './PlayoffBracket';

interface ScheduleProps {
    matches: Match[];
    teams: Team[];
    onMatchUpdate: (updatedMatch: Match) => void;
    onStartTournament: (config: { matchesPerTeamPair: number }) => void;
    canStartTournament: boolean;
    currentStage: TournamentStage;
    onCreatePlayoffMatch: (team1: Team, team2: Team, matchType: MatchType) => void;
    updateMatchId?: string | null;
}

export const Schedule = ({
    matches,
    teams,
    onMatchUpdate,
    onStartTournament,
    canStartTournament,
    currentStage,
    onCreatePlayoffMatch,
    updateMatchId
}: ScheduleProps) => {
    const [startModalOpen, setStartModalOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);

    useEffect(() => {
        if (updateMatchId) {
            const match = matches.find(m => m.id === updateMatchId);
            if (match) {
                // Find the tab index for this match
                const tabIndex = match.matchType === 'league' ? 0 : 1;
                setSelectedTab(tabIndex);
            }
        }
    }, [updateMatchId, matches]);

    const leagueMatches = matches.filter(match => match.matchType === 'league');
    const playoffMatches = matches.filter(match => match.matchType !== 'league');

    return (
        <Box>
            <Box sx={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 4
            }}>
                <Typography variant="h4" sx={{ 
                    color: '#FF8C00',
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                }}>
                    Tournament Schedule
                </Typography>
                {canStartTournament && (
                    <Button
                        variant="contained"
                        onClick={() => setStartModalOpen(true)}
                        sx={{
                            background: 'linear-gradient(135deg, #FF8C00 0%, #E67E00 100%)',
                            color: 'white',
                            fontWeight: 600,
                            px: 4,
                            py: 1.5,
                            '&:hover': {
                                background: 'linear-gradient(135deg, #E67E00 0%, #CC7000 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(255, 140, 0, 0.2)',
                            },
                            transition: 'all 0.3s ease-in-out'
                        }}
                    >
                        Start Tournament
                    </Button>
                )}
            </Box>
            
            <Box sx={{ borderBottom: 1, borderColor: '#E0E0E0', mb: 3 }}>
                <Tabs 
                    value={selectedTab} 
                    onChange={(_, newValue) => setSelectedTab(newValue)}
                    sx={{
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#FF8C00',
                        },
                        '& .MuiTab-root': {
                            color: '#616161',
                            '&.Mui-selected': {
                                color: '#FF8C00',
                            },
                            '&:hover': {
                                color: '#FF8C00',
                            },
                        },
                    }}
                >
                    <Tab label="League Matches" />
                    <Tab label="Playoffs" />
                </Tabs>
            </Box>

            {selectedTab === 0 ? (
                <Box sx={{ 
                    display: 'grid', 
                    gap: 3,
                    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }
                }}>
                    {leagueMatches.map((match) => (
                        <MatchCard 
                            key={match.id}
                            match={match}
                            onUpdate={onMatchUpdate}
                            currentStage={currentStage}
                            shouldOpenUpdateDialog={match.id === updateMatchId}
                        />
                    ))}
                    {leagueMatches.length === 0 && !canStartTournament && (
                        <Box 
                            sx={{ 
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                p: 4,
                                textAlign: 'center'
                            }}
                        >
                            <Typography variant="h6" color="textSecondary">
                                No matches scheduled yet
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                Start the tournament to generate the schedule
                            </Typography>
                        </Box>
                    )}
                </Box>
            ) : (
                <PlayoffBracket 
                    teams={teams}
                    matches={matches}
                    onMatchUpdate={onMatchUpdate}
                    onCreatePlayoffMatch={onCreatePlayoffMatch}
                    currentStage={currentStage}
                />
            )}

            <TournamentStartModal
                open={startModalOpen}
                onClose={() => setStartModalOpen(false)}
                onStart={onStartTournament}
            />
        </Box>
    );
};