import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Container,
    Tabs,
    Tab,
    Paper,
    useTheme,
    alpha
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
    const theme = useTheme();
    const [startModalOpen, setStartModalOpen] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const [hoveredTab, setHoveredTab] = useState<number | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (updateMatchId) {
            const match = matches.find(m => m.id === updateMatchId);
            if (match) {
                const tabIndex = match.matchType === 'league' ? 0 : 1;
                setSelectedTab(tabIndex);
            }
        }
    }, [updateMatchId, matches]);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const leagueMatches = matches.filter(match => match.matchType === 'league');
    const playoffMatches = matches.filter(match => match.matchType !== 'league');

    return (
        <Box sx={{
            maxWidth: 1200,
            mx: 'auto',
            px: { xs: 2, sm: 3 },
            py: { xs: 3, sm: 4 }
        }}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'opacity 0.5s ease-out, transform 0.5s ease-out'
                }}
            >
                <Typography
                    variant="h4"
                    sx={{
                        background: 'linear-gradient(45deg, #FF8C00, #FF1640)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        fontWeight: 700,
                        letterSpacing: '0.02em',
                        textShadow: '0px 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    Tournament Schedule
                </Typography>
                {canStartTournament && (
                    <Button
                        variant="contained"
                        onClick={() => setStartModalOpen(true)}
                        sx={{
                            background: 'linear-gradient(45deg, #FF8C00, #FF1640)',
                            color: 'white',
                            fontWeight: 600,
                            px: 4,
                            py: 1.5,
                            borderRadius: '8px',
                            boxShadow: '0 4px 15px rgba(255, 140, 0, 0.2)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #FF1640, #FF8C00)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(255, 140, 0, 0.3)',
                            },
                            transition: 'all 0.3s ease-in-out'
                        }}
                    >
                        Start Tournament
                    </Button>
                )}
            </Box>

            <Paper
                elevation={0}
                sx={{
                    borderRadius: '12px',
                    overflow: 'hidden',
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    mb: 3
                }}
            >
                <Tabs
                    value={selectedTab}
                    onChange={(_, newValue) => setSelectedTab(newValue)}
                    sx={{
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#FF1640',
                            height: '3px',
                            borderRadius: '3px'
                        },
                        '& .MuiTab-root': {
                            color: '#666666',
                            fontSize: '1rem',
                            fontWeight: 500,
                            textTransform: 'none',
                            minHeight: '56px',
                            transition: 'all 0.3s ease',
                            '&.Mui-selected': {
                                color: '#FF1640',
                                fontWeight: 600
                            },
                            '&:hover': {
                                color: '#FF1640',
                                backgroundColor: alpha('#FF1640', 0.04)
                            }
                        }
                    }}
                >
                    <Tab
                        label="League Matches"
                        onMouseEnter={() => setHoveredTab(0)}
                        onMouseLeave={() => setHoveredTab(null)}
                        sx={{
                            position: 'relative',
                            '&::after': hoveredTab === 0 ? {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '3px',
                                background: 'linear-gradient(45deg, #FF8C00, #FF1640)',
                                opacity: 0.5,
                                transition: 'opacity 0.3s ease'
                            } : {}
                        }}
                    />
                    <Tab
                        label="Playoffs"
                        onMouseEnter={() => setHoveredTab(1)}
                        onMouseLeave={() => setHoveredTab(null)}
                        sx={{
                            position: 'relative',
                            '&::after': hoveredTab === 1 ? {
                                content: '""',
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: '3px',
                                background: 'linear-gradient(45deg, #FF8C00, #FF1640)',
                                opacity: 0.5,
                                transition: 'opacity 0.3s ease'
                            } : {}
                        }}
                    />
                </Tabs>
            </Paper>

            <Box
                sx={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'opacity 0.5s ease-out 0.2s, transform 0.5s ease-out 0.2s'
                }}
            >
                {selectedTab === 0 ? (
                    <Box sx={{
                        display: 'grid',
                        gap: 3,
                        gridTemplateColumns: {
                            xs: '1fr',
                            md: 'repeat(auto-fill, minmax(400px, 1fr))'
                        }
                    }}>
                        {leagueMatches.map((match, index) => (
                            <Box
                                key={match.id}
                                sx={{
                                    opacity: isVisible ? 1 : 0,
                                    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                                    transition: `opacity 0.5s ease-out ${index * 0.1}s, transform 0.5s ease-out ${index * 0.1}s`
                                }}
                            >
                                <MatchCard
                                    match={match}
                                    onUpdate={onMatchUpdate}
                                    currentStage={currentStage}
                                    shouldOpenUpdateDialog={match.id === updateMatchId}
                                />
                            </Box>
                        ))}
                        {leagueMatches.length === 0 && !canStartTournament && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    p: 6,
                                    textAlign: 'center',
                                    bgcolor: 'background.paper',
                                    borderRadius: '12px',
                                    border: '1px dashed',
                                    borderColor: 'divider',
                                    opacity: isVisible ? 1 : 0,
                                    transform: isVisible ? 'scale(1)' : 'scale(0.9)',
                                    transition: 'opacity 0.5s ease-out, transform 0.5s ease-out'
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: 'text.primary',
                                        mb: 1,
                                        fontWeight: 600
                                    }}
                                >
                                    No matches scheduled yet
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'text.secondary',
                                        maxWidth: '400px'
                                    }}
                                >
                                    Start the tournament to generate the schedule and begin managing your matches
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
            </Box>

            <TournamentStartModal
                open={startModalOpen}
                onClose={() => setStartModalOpen(false)}
                onStart={onStartTournament}
            />
        </Box>
    );
}