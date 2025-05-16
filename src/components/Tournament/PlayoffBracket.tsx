import React from 'react';
import { Box, Paper, Typography, Button } from '@mui/material';
import type { Match, Team, TournamentStage } from '../../types';
import { MatchCard } from '../Matches/MatchCard';

interface PlayoffBracketProps {
    teams: Team[];
    matches: Match[];
    onMatchUpdate: (match: Match) => void;
    onCreatePlayoffMatch: (team1: Team, team2: Team, matchType: 'qualifier' | 'final') => void;
    currentStage: TournamentStage;
}

export const PlayoffBracket = ({ 
    teams, 
    matches, 
    onMatchUpdate, 
    onCreatePlayoffMatch,
    currentStage 
}: PlayoffBracketProps) => {
    // Check if all league matches are completed
    const leagueMatches = matches.filter(m => m.matchType === 'league');
    const allLeagueMatchesCompleted = leagueMatches.length > 0 && 
        leagueMatches.every(m => m.status === 'completed' || m.status === 'tied');

    const calculateTeamStats = (team: Team) => {
        const teamMatches = matches.filter(m => 
            m.matchType === 'league' && 
            (m.team1.id === team.id || m.team2.id === team.id) &&
            m.result
        );

        const stats = {
            points: 0,
            wins: 0,
            losses: 0,
            ties: 0,
            runsScored: 0,
            runsConceded: 0,
            oversPlayed: 0,
            oversFaced: 0
        };

        teamMatches.forEach(match => {
            if (!match.result) return;

            const isTeam1 = match.team1.id === team.id;
            const teamScore = isTeam1 ? match.result.team1Score : match.result.team2Score;
            const opposingScore = isTeam1 ? match.result.team2Score : match.result.team1Score;

            if (match.result.result === 'tie') {
                stats.points += 1;
                stats.ties += 1;
            } else if (match.result.winner?.id === team.id) {
                stats.points += 2;
                stats.wins += 1;
            } else {
                stats.losses += 1;
            }

            stats.runsScored += teamScore.runs;
            stats.runsConceded += opposingScore.runs;
            stats.oversPlayed += parseFloat(teamScore.overs.toString());
            stats.oversFaced += parseFloat(opposingScore.overs.toString());
        });

        const nrr = stats.oversPlayed && stats.oversFaced ? 
            (stats.runsScored / stats.oversPlayed) - (stats.runsConceded / stats.oversFaced) : 0;

        return { ...stats, nrr };
    };

    const sortedTeams = [...teams].sort((a, b) => {
        const statsA = calculateTeamStats(a);
        const statsB = calculateTeamStats(b);

        if (statsB.points !== statsA.points) {
            return statsB.points - statsA.points;
        }
        if (statsB.nrr !== statsA.nrr) {
            return statsB.nrr - statsA.nrr;
        }
        if (statsB.wins !== statsA.wins) {
            return statsB.wins - statsA.wins;
        }

        const headToHead = matches.filter(m => 
            m.matchType === 'league' &&
            ((m.team1.id === a.id && m.team2.id === b.id) ||
             (m.team1.id === b.id && m.team2.id === a.id)) &&
            m.result?.winner
        );

        if (headToHead.length > 0) {
            const aWins = headToHead.filter(m => m.result?.winner?.id === a.id).length;
            const bWins = headToHead.filter(m => m.result?.winner?.id === b.id).length;
            return bWins - aWins;
        }

        return 0;
    });

    const qualifierMatch = matches.find(m => m.matchType === 'qualifier');
    const finalMatch = matches.find(m => m.matchType === 'final');

    // Get super duper over matches
    const qualifierSuperDuperOvers = matches
        .filter(m => m.matchType === 'super_duper_over' && m.parentMatchId === qualifierMatch?.id)
        .sort((a, b) => (a.date?.getTime() || 0) - (b.date?.getTime() || 0));

    const finalSuperDuperOvers = matches
        .filter(m => m.matchType === 'super_duper_over' && m.parentMatchId === finalMatch?.id)
        .sort((a, b) => (a.date?.getTime() || 0) - (b.date?.getTime() || 0));

    const canCreateQualifier = allLeagueMatchesCompleted && 
                             currentStage === ('qualifier' as TournamentStage) && 
                             sortedTeams.length >= 3 && 
                             !qualifierMatch;

    const handleCreateQualifier = () => {
        if (!canCreateQualifier) return;
        onCreatePlayoffMatch(sortedTeams[1], sortedTeams[2], 'qualifier');
    };

    const handleCreateFinal = () => {
        if (!qualifierMatch?.result?.winner || !sortedTeams[0]) return;
        onCreatePlayoffMatch(sortedTeams[0], qualifierMatch.result.winner, 'final');
    };

    const renderSuperDuperOvers = (matches: Match[], parentMatch: Match | undefined) => {
        if (!matches.length || parentMatch?.status !== 'tied') return null;

        return (
            <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" sx={{ mb: 1, color: '#FF8C00', fontWeight: 600 }}>
                    Super Duper Over{matches.length > 1 ? 's' : ''}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {matches.map((match, index) => (
                        <Box key={match.id} sx={{ position: 'relative' }}>
                            {index > 0 && (
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        position: 'absolute',
                                        top: -8,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        bgcolor: '#FF8C00',
                                        color: 'white',
                                        px: 1,
                                        py: 0.25,
                                        borderRadius: 1,
                                        fontSize: '0.75rem'
                                    }}
                                >
                                    Still Tied! Super Duper Over {index + 1}
                                </Typography>
                            )}
                            <MatchCard 
                                match={match} 
                                onUpdate={onMatchUpdate}
                                currentStage={currentStage}
                            />
                        </Box>
                    ))}
                </Box>
            </Box>
        );
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <Box sx={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
                {/* First Place - Direct to Final */}
                <Paper sx={{ p: 2, flex: 1, bgcolor: '#f8f9fa' }}>
                    <Typography variant="h6" gutterBottom sx={{ color: '#001838' }}>
                        1st Place (Direct Final)
                    </Typography>
                    <Box sx={{ 
                        p: 2, 
                        border: '2px solid #4CAF50', 
                        borderRadius: 2, 
                        bgcolor: 'white',
                        opacity: allLeagueMatchesCompleted ? 1 : 0.7
                    }}>
                        <Typography variant="body1" sx={{ 
                            fontWeight: 600,
                            color: allLeagueMatchesCompleted ? '#001838' : '#666666'
                        }}>
                            {allLeagueMatchesCompleted && sortedTeams.length > 0 ? sortedTeams[0]?.name : 'TBD (League in Progress)'}
                        </Typography>
                    </Box>
                </Paper>

                {/* Qualifier Match */}
                <Paper sx={{ p: 2, flex: 2, bgcolor: '#f8f9fa' }}>
                    <Typography variant="h6" gutterBottom sx={{ color: '#001838' }}>
                        Qualifier (2nd vs 3rd)
                    </Typography>
                    {qualifierMatch ? (
                        <>
                            <MatchCard 
                                match={qualifierMatch} 
                                onUpdate={onMatchUpdate}
                                currentStage={currentStage}
                            />
                            {renderSuperDuperOvers(qualifierSuperDuperOvers, qualifierMatch)}
                        </>
                    ) : (
                        <>
                            {canCreateQualifier ? (
                                <Button
                                    variant="contained"
                                    onClick={handleCreateQualifier}
                                    fullWidth
                                    sx={{
                                        bgcolor: '#FF6B00',
                                        '&:hover': { bgcolor: '#cc5500' }
                                    }}
                                >
                                    Create Qualifier Match
                                </Button>
                            ) : (
                                <Typography 
                                    variant="caption" 
                                    sx={{ 
                                        display: 'block', 
                                        textAlign: 'center', 
                                        mt: 1,
                                        color: '#666666'
                                    }}
                                >
                                    {!allLeagueMatchesCompleted ? 'Complete all league matches to enable' :
                                     currentStage !== ('qualifier' as TournamentStage) ? 'Waiting for qualifier stage' :
                                     'Unable to create qualifier match'}
                                </Typography>
                            )}
                        </>
                    )}
                </Paper>

                {/* Final Match */}
                <Paper sx={{ p: 2, flex: 2, bgcolor: '#f8f9fa' }}>
                    <Typography variant="h6" gutterBottom sx={{ color: '#001838' }}>
                        Final
                    </Typography>
                    {finalMatch ? (
                        <>
                            <MatchCard 
                                match={finalMatch} 
                                onUpdate={onMatchUpdate}
                                currentStage={currentStage}
                            />
                            {renderSuperDuperOvers(finalSuperDuperOvers, finalMatch)}
                        </>
                    ) : qualifierMatch?.result?.winner ? (
                        <Button
                            variant="contained"
                            onClick={handleCreateFinal}
                            fullWidth
                            sx={{
                                bgcolor: '#FF6B00',
                                '&:hover': { bgcolor: '#cc5500' }
                            }}
                        >
                            Create Final Match
                        </Button>
                    ) : (
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                            {allLeagueMatchesCompleted ? 'Waiting for Qualifier result' : 'League matches in progress'}
                        </Typography>
                    )}
                </Paper>
            </Box>
        </Box>
    );
}; 