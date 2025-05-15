import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Tournament, Team, Match, MatchType } from '../types';
import { generateLeagueSchedule } from '../utils/scheduleGenerator';
import { generatePointsTable } from '../utils/pointsCalculator';
import { saveToStorage, loadFromStorage } from '../utils/storage';
import { compressImage } from '../utils/imageCompression';

const STORAGE_KEY = 'cricket_tournament';

export interface TournamentContextType {
    tournament: Tournament;
    handleAddTeam: (newTeam: { name: string; logo: string }) => Promise<void>;
    handleRemoveTeam: (teamId: string) => void;
    handleStartTournament: (config: { matchesPerTeamPair: number }) => void;
    handleCreatePlayoffMatch: (team1: Team, team2: Team, matchType: MatchType) => void;
    handleUpdateMatch: (updatedMatch: Match) => void;
    handleResetTeams: () => void;
    handleContinueWithTeams: () => void;
    error: string | null;
    setError: (error: string | null) => void;
}

const TournamentContext = createContext<TournamentContextType | undefined>(undefined);

export function TournamentProvider({ children }: { children: React.ReactNode }) {
    const [tournament, setTournament] = useState<Tournament>(() => {
        try {
            const savedData = loadFromStorage(STORAGE_KEY);
            if (savedData) {
                return savedData;
            }
        } catch (error) {
            console.error('Failed to load tournament data:', error);
        }
        return {
            id: crypto.randomUUID(),
            name: "RC FRIENDS CRICKET LEAGUE 25",
            teams: [],
            matches: [],
            status: 'upcoming',
            currentStage: 'league',
            pointsTable: [],
            config: {
                matchesPerTeamPair: 1
            }
        };
    });

    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        try {
            saveToStorage(STORAGE_KEY, tournament);
        } catch (error) {
            console.error('Failed to save tournament data:', error);
            setError('Failed to save tournament data. Some data might be lost.');
        }
    }, [tournament]);

    useEffect(() => {
        const leagueMatches = tournament.matches.filter(m => m.matchType === 'league');
        const updatedPointsTable = generatePointsTable(tournament.teams, leagueMatches);
        if (JSON.stringify(updatedPointsTable) !== JSON.stringify(tournament.pointsTable)) {
            setTournament(prev => ({
                ...prev,
                pointsTable: updatedPointsTable
            }));
        }
    }, [tournament.matches, tournament.teams]);

    const handleAddTeam = async (newTeam: { name: string; logo: string }) => {
        try {
            const compressedLogo = await compressImage(newTeam.logo);
            const team: Team = {
                ...newTeam,
                id: crypto.randomUUID(),
                logo: compressedLogo
            };
            
            setTournament(prev => ({
                ...prev,
                teams: [...prev.teams, team]
            }));
        } catch (error) {
            console.error('Failed to add team:', error);
            setError('Failed to add team. Please try again with a smaller image.');
        }
    };

    const handleRemoveTeam = (teamId: string) => {
        setTournament(prev => ({
            ...prev,
            teams: prev.teams.filter(team => team.id !== teamId)
        }));
    };

    const handleStartTournament = (config: { matchesPerTeamPair: number }) => {
        if (tournament.teams.length < 2) {
            setError('Need at least 2 teams to start the tournament');
            return;
        }

        const matches = generateLeagueSchedule(tournament.teams, config.matchesPerTeamPair);
        setTournament(prev => ({
            ...prev,
            matches,
            status: 'ongoing',
            config: {
                matchesPerTeamPair: config.matchesPerTeamPair
            }
        }));
    };

    const handleCreatePlayoffMatch = (team1: Team, team2: Team, matchType: MatchType) => {
        const newMatch: Match = {
            id: crypto.randomUUID(),
            team1,
            team2,
            matchType,
            status: 'scheduled',
            date: new Date(),
            time: format(new Date(), 'HH:mm'),
            venue: 'Wankhede Stadium, Mumbai'
        };

        setTournament(prev => {
            const leagueMatches = prev.matches.filter(m => m.matchType === 'league');
            const allLeagueMatchesCompleted = leagueMatches.every(m => 
                m.status === 'completed' || m.status === 'tied'
            );

            if (!allLeagueMatchesCompleted && matchType === 'qualifier') {
                console.warn('Cannot create qualifier match before all league matches are completed');
                return prev;
            }

            let newStage = prev.currentStage;
            if (matchType === 'qualifier' || matchType === 'final') {
                newStage = matchType;
            }

            return {
                ...prev,
                matches: [...prev.matches, newMatch],
                currentStage: newStage
            };
        });
    };

    const handleUpdateMatch = (updatedMatch: Match) => {
        setTournament(prev => {
            // Get the next match number if this match is being completed
            let nextMatchNumber = 1;
            if (updatedMatch.status === 'completed' && !updatedMatch.matchNumber) {
                const completedMatches = prev.matches.filter(m => m.matchNumber);
                nextMatchNumber = completedMatches.length > 0 
                    ? Math.max(...completedMatches.map(m => m.matchNumber || 0)) + 1 
                    : 1;
                updatedMatch = { ...updatedMatch, matchNumber: nextMatchNumber };
            }

            const updatedMatches = prev.matches.map(match =>
                match.id === updatedMatch.id ? updatedMatch : match
            );

            const leagueMatches = updatedMatches.filter(m => m.matchType === 'league');
            const allLeagueMatchesCompleted = leagueMatches.length > 0 && leagueMatches.every(m => 
                m.status === 'completed' || m.status === 'tied'
            );

            // Debug logs for stage transition
            console.log('Stage Transition Debug:', {
                currentStage: prev.currentStage,
                allLeagueMatchesCompleted,
                leagueMatchesCount: leagueMatches.length,
                completedCount: leagueMatches.filter(m => m.status === 'completed' || m.status === 'tied').length,
                updatedMatchType: updatedMatch.matchType,
                updatedMatchStatus: updatedMatch.status,
                leagueMatchStatuses: leagueMatches.map(m => ({
                    id: m.id,
                    status: m.status,
                    team1: m.team1.name,
                    team2: m.team2.name
                }))
            });

            const qualifierMatch = updatedMatches.find(m => m.matchType === 'qualifier');
            const finalMatch = updatedMatches.find(m => m.matchType === 'final');

            if (updatedMatch.status === 'tied' && 
                (updatedMatch.matchType === 'qualifier' || 
                 updatedMatch.matchType === 'final' || 
                 updatedMatch.matchType === 'super_duper_over')) {
                
                const superDuperOverMatch: Match = {
                    id: crypto.randomUUID(),
                    team1: updatedMatch.team1,
                    team2: updatedMatch.team2,
                    matchType: 'super_duper_over',
                    status: 'scheduled',
                    venue: updatedMatch.venue,
                    parentMatchId: updatedMatch.parentMatchId || updatedMatch.id,
                    isSuperDuperOver: true,
                    date: new Date()
                };
                updatedMatches.push(superDuperOverMatch);
            }

            let newStage = prev.currentStage;
            
            // Only transition to qualifier stage if we're in league stage and all league matches are done
            if (allLeagueMatchesCompleted && prev.currentStage === 'league') {
                console.log('All league matches completed, transitioning to qualifier stage');
                newStage = 'qualifier';
            } 
            // Only transition to final stage if qualifier is complete and we're in qualifier stage
            else if (qualifierMatch?.status === 'completed' || qualifierMatch?.status === 'tied') {
                console.log('Qualifier match completed/tied');
                if (!finalMatch && prev.currentStage === 'qualifier') {
                    const qualifierWinner = qualifierMatch.result?.winner || 
                        updatedMatches
                            .filter(m => m.matchType === 'super_duper_over' && m.parentMatchId === qualifierMatch.id)
                            .sort((a, b) => {
                                const dateA = a.date ? new Date(a.date).getTime() : 0;
                                const dateB = b.date ? new Date(b.date).getTime() : 0;
                                return dateB - dateA;
                            })
                            .find(m => m.result?.winner)?.result?.winner;

                    if (qualifierWinner) {
                        console.log('Qualifier winner found, transitioning to final stage');
                        const firstPlaceTeam = prev.pointsTable[0]?.team;
                        if (firstPlaceTeam) {
                            const finalMatch: Match = {
                                id: crypto.randomUUID(),
                                team1: firstPlaceTeam,
                                team2: qualifierWinner,
                                matchType: 'final',
                                status: 'scheduled',
                                venue: 'Final Venue',
                                date: new Date(),
                                time: format(new Date(), 'HH:mm')
                            };
                            updatedMatches.push(finalMatch);
                            newStage = 'final';
                        }
                    }
                }
            }

            const finalMatchComplete = finalMatch?.status === 'completed' || 
                (finalMatch?.status === 'tied' && updatedMatches
                    .filter(m => m.matchType === 'super_duper_over' && m.parentMatchId === finalMatch.id)
                    .sort((a, b) => {
                        const dateA = a.date ? new Date(a.date).getTime() : 0;
                        const dateB = b.date ? new Date(b.date).getTime() : 0;
                        return dateB - dateA;
                    })
                    .find(m => m.result?.winner));

            if (finalMatchComplete) {
                return {
                    ...prev,
                    matches: updatedMatches,
                    pointsTable: generatePointsTable(prev.teams, leagueMatches),
                    currentStage: newStage,
                    status: 'completed'
                };
            }

            return {
                ...prev,
                matches: updatedMatches,
                pointsTable: generatePointsTable(prev.teams, leagueMatches),
                currentStage: newStage
            };
        });
    };

    const handleResetTeams = () => {
        setTournament(prev => ({
            ...prev,
            teams: [],
            matches: [],
            status: 'upcoming',
            currentStage: 'league',
            pointsTable: []
        }));
    };

    const handleContinueWithTeams = () => {
        setTournament(prev => ({
            ...prev,
            matches: [],
            status: 'upcoming',
            currentStage: 'league',
            pointsTable: []
        }));
    };

    const value: TournamentContextType = {
        tournament,
        handleAddTeam,
        handleRemoveTeam,
        handleStartTournament,
        handleCreatePlayoffMatch,
        handleUpdateMatch,
        handleResetTeams,
        handleContinueWithTeams,
        error,
        setError
    };

    return (
        <TournamentContext.Provider value={value}>
            {children}
        </TournamentContext.Provider>
    );
}

export function useTournamentContext(): TournamentContextType {
    const context = useContext(TournamentContext);
    if (context === undefined) {
        throw new Error('useTournamentContext must be used within a TournamentProvider');
    }
    return context;
}

// Export the context for testing purposes only
export { TournamentContext }; 