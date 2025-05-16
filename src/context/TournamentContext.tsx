import React, { createContext, useContext, useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Tournament, Team, Match, MatchType } from '../types';
import { generateLeagueSchedule } from '../utils/scheduleGenerator';
import { generatePointsTable } from '../utils/pointsCalculator';
import { compressImage } from '../utils/imageCompression';
import { databaseService } from '../services/databaseService';

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
    }));

    const [error, setError] = useState<string | null>(null);

    // Load initial tournament data from Firebase
    useEffect(() => {
        const loadTournament = async () => {
            try {
                const tournaments = await databaseService.getAllTournaments();
                if (tournaments.length > 0) {
                    setTournament(tournaments[0]);
                } else {
                    // Create initial tournament in Firebase
                    await databaseService.saveTournament(tournament);
                }
            } catch (error) {
                console.error('Error loading tournament:', error);
                setError('Failed to load tournament data');
            }
        };

        loadTournament();
    }, []);

    const handleAddTeam = async (newTeam: { name: string; logo: string }) => {
        try {
            const compressedLogo = await compressImage(newTeam.logo);
            const team: Team = {
                ...newTeam,
                id: crypto.randomUUID(),
                logo: compressedLogo
            };
            
            // Add team to Firebase
            await databaseService.addTeam(tournament.id, team);
            
            setTournament((prev: Tournament) => ({
                ...prev,
                teams: [...prev.teams, team]
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
                teams: prev.teams.filter((team: Team) => team.id !== teamId)
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
            id: crypto.randomUUID(),
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

    const handleUpdateMatch = async (updatedMatch: Match) => {
        try {
            await databaseService.updateMatch(tournament.id, updatedMatch);
            
            const updatedTournament = {
                ...tournament,
                matches: tournament.matches.map((match: Match) =>
                    match.id === updatedMatch.id ? updatedMatch : match
                )
            };

            if (updatedMatch.status === 'completed' || updatedMatch.status === 'tied') {
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
                pointsTable: []
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
                pointsTable: []
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