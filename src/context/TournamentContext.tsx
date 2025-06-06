import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Tournament, Team, Match, MatchType, TeamDetails } from '../types';
import { generateLeagueSchedule } from '../utils/scheduleGenerator';
import { generatePointsTable } from '../utils/pointsCalculator';
import { compressImage } from '../utils/imageCompression';
import { databaseService } from '../services/databaseService';
import { generateUUID } from '../utils/uuid';
import { getSortedMatchData } from '../utils/matchUtils';
import { t } from 'framer-motion/dist/types.d-CtuPurYT';

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
    const [tournament, setTournament] = useState<Tournament>(() => ({
        id: generateUUID(),
        name: "RC FRIENDS CRICKET LEAGUE 25",
        teams: [],
        matches: [],
        status: 'upcoming',
        currentStage: 'league',
        pointsTable: [],
        config: {
            matchesPerTeamPair: 1
        },
        teamDetails: [],
        matchesCompleted: 0
    }));

    const [error, setError] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load or create initial tournament data
    useEffect(() => {
        const initializeTournament = async () => {
            try {
                const tournaments = await databaseService.getAllTournaments();
                if (tournaments.length > 0) {
                    // Update points table for existing tournament
                    const existingTournament = tournaments[0];
                    existingTournament.pointsTable = generatePointsTable(existingTournament.teams, existingTournament.matches);
                    setTournament(existingTournament);
                } else {
                    // Create initial tournament in Firebase
                    const newTournament: Tournament = {
                        id: generateUUID(),
                        name: "RC FRIENDS CRICKET LEAGUE 25",
                        teams: [],
                        matches: [],
                        status: 'upcoming',
                        currentStage: 'league',
                        pointsTable: [],
                        config: {
                            matchesPerTeamPair: 1
                        },
                        teamDetails: [],
                        matchesCompleted: 0
                    };
                    // await databaseService.saveTournament(newTournament);
                    setTournament(newTournament);
                }
                setIsInitialized(true);
            } catch (error) {
                console.error('Error initializing tournament:', error);
                setError('Failed to initialize tournament data');
            }
        };

        initializeTournament();
    }, []);

    // Update points table whenever matches or teams change
    useEffect(() => {
        if (tournament.teams.length > 0 && tournament.matches.length > 0) {
            const updatedPointsTable = generatePointsTable(tournament.teams, tournament.matches);
            if (JSON.stringify(updatedPointsTable) !== JSON.stringify(tournament.pointsTable)) {
                setTournament((prev: Tournament) => ({
                    ...prev,
                    pointsTable: updatedPointsTable
                }));
            }
        }
    }, [tournament.teams, tournament.matches]);

    const handleAddTeam = async (newTeam: { name: string; logo: string, selfDescription: string }) => {
        try {
            const compressedLogo = await compressImage(newTeam.logo);
            const teamDetails: TeamDetails = {
                ...newTeam,
                id: generateUUID(),
                logo: compressedLogo
            };

            // Add team to Firebase
            await databaseService.addTeam(tournament.id, teamDetails);

            setTournament((prev: Tournament) => ({
                ...prev,
                teams: [...prev.teams, {
                    id: teamDetails.id,
                    name: teamDetails.name
                }],
                teamDetails: [...prev.teamDetails, teamDetails]
            }));
        } catch (error) {
            console.error('Failed to add team:', error);
            setError('Failed to add team. Please try again with a smaller image.');
        }
    };

    const handleRemoveTeam = async (teamId: string) => {
        try {
            // Remove team from Firebase
            await databaseService.removeTeam(tournament.id, teamId);

            setTournament((prev: Tournament) => ({
                ...prev,
                teams: prev.teams.filter((team: Team) => team.id !== teamId),
                teamDetails: prev.teamDetails.filter((teamDetail: TeamDetails) => teamDetail.id !== teamId) 
            }));
        } catch (error) {
            console.error('Failed to remove team:', error);
            setError('Failed to remove team. Please try again.');
        }
    };

    const handleStartTournament = async (config: { matchesPerTeamPair: number }) => {
        if (tournament.teams.length < 2) {
            setError('Need at least 2 teams to start the tournament');
            return;
        }

        const matches = generateLeagueSchedule(tournament.teams, config.matchesPerTeamPair);
        const updatedTournament = {
            ...tournament,
            matches,
            matchesCompleted: 0,
            status: 'ongoing' as const,
            config: {
                matchesPerTeamPair: config.matchesPerTeamPair
            }
        };

        try {
            // Update tournament in Firebase
            await databaseService.updateTournament(updatedTournament);
            setTournament(updatedTournament);
        } catch (error) {
            console.error('Failed to start tournament:', error);
            setError('Failed to start tournament. Please try again.');
        }
    };

    const handleCreatePlayoffMatch = async (team1: Team, team2: Team, matchType: MatchType) => {
        const newMatch: Match = {
            id: generateUUID(),
            team1,
            team2,
            matchType,
            status: 'scheduled',
            date: new Date(),
            time: format(new Date(), 'HH:mm'),
            venue: 'Wankhede Stadium, Mumbai'
        };

        try {
            await databaseService.updateMatch(tournament.id, newMatch);
            const updatedTournament = {
                ...tournament,
                matches: [...tournament.matches, newMatch],
                currentStage: matchType === 'qualifier' || matchType === 'final' ? matchType : tournament.currentStage
            };
            await databaseService.updateTournament(updatedTournament);
            setTournament(updatedTournament);
        } catch (error) {
            console.error('Failed to create playoff match:', error);
            setError('Failed to create playoff match. Please try again.');
        }
    };
    const sortMatches = (matches: Match[]) => {
        // Separate completed and non-completed matches
        const completedMatches = matches.filter(match => match.status === 'completed');
        const nonCompletedMatches = matches.filter(match => match.status !== 'completed');

        // Sort completed matches by timestamp in reverse chronological order
        const sortedCompletedMatches = getSortedMatchData(completedMatches)

        return [...sortedCompletedMatches, ...nonCompletedMatches];
    };

    const handleUpdateMatch = async (updatedMatch: Match) => {
        try {
            await databaseService.updateMatch(tournament.id, updatedMatch);
            const updatedMatches = tournament.matches.map((match: Match) =>
                match.id === updatedMatch.id ? updatedMatch : match
            )
            const updatedTournament = {
                ...tournament,
                matches: sortMatches(updatedMatches),
            };

            if (updatedMatch.status === 'completed' || updatedMatch.status === 'tied') {
                updatedTournament.matchesCompleted = updatedMatches.filter((m: Match) => m.status === 'completed' || m.status === 'tied').length;
                const leagueMatches = updatedTournament.matches.filter((m: Match) => m.matchType === 'league');
                const allLeagueMatchesCompleted = leagueMatches.every((m: Match) =>
                    m.status === 'completed' || m.status === 'tied'
                );

                if (allLeagueMatchesCompleted && updatedTournament.currentStage === 'league') {
                    updatedTournament.currentStage = 'qualifier';
                }

                const qualifierMatch = updatedTournament.matches.find((m: Match) => m.matchType === 'qualifier');
                if (qualifierMatch?.status === 'completed' || qualifierMatch?.status === 'tied') {
                    updatedTournament.currentStage = 'final';
                }

                const finalMatch = updatedTournament.matches.find((m: Match) => m.matchType === 'final');
                if (finalMatch?.status === 'completed' || finalMatch?.status === 'tied') {
                    updatedTournament.status = 'completed';
                }
            }

            await databaseService.updateTournament(updatedTournament);
            setTournament(updatedTournament);
        } catch (error) {
            console.error('Failed to update match:', error);
            setError('Failed to update match. Please try again.');
        }
    };

    const handleResetTeams = async () => {
        try {
            const newTournament = {
                ...tournament,
                teams: [],
                matches: [],
                status: 'upcoming' as const,
                currentStage: 'league' as const,
                pointsTable: [],
                teamDetails: [],
                matchesCompleted: 0
            };
            await databaseService.updateTournament(newTournament);
            setTournament(newTournament);
        } catch (error) {
            console.error('Failed to reset teams:', error);
            setError('Failed to reset teams. Please try again.');
        }
    };

    const handleContinueWithTeams = async () => {
        try {
            const newTournament = {
                ...tournament,
                matches: [],
                status: 'upcoming' as const,
                currentStage: 'league' as const,
                pointsTable: [],
                matchesCompleted: 0,
                
            };
            await databaseService.updateTournament(newTournament);
            setTournament(newTournament);
        } catch (error) {
            console.error('Failed to continue with teams:', error);
            setError('Failed to continue with teams. Please try again.');
        }
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