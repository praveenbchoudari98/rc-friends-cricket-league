import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
import { Tournament, Match, Team, TeamDetails, TeamStats } from '../types';
import { db } from '../config/firebase';

// Enhanced debugging to verify Firestore connection
console.log('Verifying Firestore connection...');
getDocs(collection(db, 'tournaments'))
    .then(() => console.log('✅ Firestore connection verified'))
    .catch(error => console.error('❌ Firestore connection failed:', error));

// Keep Team references minimal so logos/selfDescription don't leak into matches/points table.
const toTeamRef = (team: Team): Team => ({ id: team.id, name: team.name });

// Remove undefined values recursively (Firestore doesn't accept undefined)
const removeUndefinedValues = (obj: any): any => {
    if (obj === null || obj === undefined) return undefined;
    if (Array.isArray(obj)) return obj.map(removeUndefinedValues).filter(v => v !== undefined);
    if (typeof obj !== 'object') return obj;
    
    const cleaned: any = {};
    for (const [key, value] of Object.entries(obj)) {
        const cleanedValue = removeUndefinedValues(value);
        if (cleanedValue !== undefined) {
            cleaned[key] = cleanedValue;
        }
    }
    return cleaned;
};

const sanitizeMatch = (match: Match): Match => ({
    ...match,
    team1: toTeamRef(match.team1),
    team2: toTeamRef(match.team2),
    result: match.result ? {
        ...match.result,
        winner: match.result.winner ? toTeamRef(match.result.winner) : undefined
    } : undefined,
    inningsInfo: match.inningsInfo ? {
        ...match.inningsInfo,
        tossWinner: toTeamRef(match.inningsInfo.tossWinner),
        battingFirst: toTeamRef(match.inningsInfo.battingFirst)
    } : undefined
});

const sanitizeTeamStats = (stat: TeamStats): Omit<TeamStats, 'teamDetails'> => {
    const { teamDetails, ...rest } = stat;
    return {
        ...rest,
        team: toTeamRef(stat.team)
    };
};

const sanitizeTournament = (tournament: Tournament): any => {
    const sanitized = {
        ...tournament,
        teams: tournament.teams.map(toTeamRef),
        matches: tournament.matches.map(sanitizeMatch),
        pointsTable: tournament.pointsTable.map(sanitizeTeamStats)
    };
    return removeUndefinedValues(sanitized);
};

export const databaseService = {
    async saveTournament(tournament: Tournament): Promise<void> {
        console.log('Attempting to save tournament:', tournament.id);
        try {
            const tournamentRef = doc(db, 'tournaments', tournament.id);
            await setDoc(tournamentRef, { ...sanitizeTournament(tournament) });
            console.log('Tournament saved successfully:', tournament.id);
        } catch (error) {
            console.error('Error saving tournament:', error);
            throw error;
        }
    },

    async getAllTournaments(): Promise<Tournament[]> {
        console.log('Fetching all tournaments...');
        try {
            const tournamentsRef = collection(db, 'tournaments');
            const tournamentsSnap = await getDocs(tournamentsRef);
            const tournaments = tournamentsSnap.docs.map(doc => ({
                ...doc.data(),
                id: doc.id
            })) as Tournament[];
            console.log('Fetched tournaments:', tournaments.length);
            return tournaments.map(sanitizeTournament);
        } catch (error) {
            console.error('Error getting all tournaments:', error);
            throw error;
        }
    },

    async getTournament(id: string): Promise<Tournament | null> {
        try {
            const tournamentRef = doc(db, 'tournaments', id);
            const tournamentSnap = await getDoc(tournamentRef);
            if (!tournamentSnap.exists()) {
                return null;
            }
            return sanitizeTournament({
                ...tournamentSnap.data(),
                id: tournamentSnap.id
            } as Tournament);
        } catch (error) {
            console.error('Error getting tournament:', error);
            throw error;
        }
    },

    async updateTournament(tournament: Tournament): Promise<void> {
        try {
            const tournamentRef = doc(db, 'tournaments', tournament.id);
            const sanitized = sanitizeTournament(tournament);
            await updateDoc(tournamentRef, sanitized);
        } catch (error) {
            console.error('Error updating tournament:', error);
            throw error;
        }
    },

    async deleteTournament(id: string): Promise<void> {
        try {
            const tournamentRef = doc(db, 'tournaments', id);
            await deleteDoc(tournamentRef);
        } catch (error) {
            console.error('Error deleting tournament:', error);
            throw error;
        }
    },

    async updateMatch(tournamentId: string, match: Match): Promise<void> {
        try {
            const tournamentRef = doc(db, 'tournaments', tournamentId);
            const tournamentSnap = await getDoc(tournamentRef);

            if (!tournamentSnap.exists()) {
                throw new Error('Tournament not found');
            }

            const tournament = {
                ...tournamentSnap.data(),
                id: tournamentSnap.id
            } as Tournament;

            const matchIndex = tournament.matches.findIndex(m => m.id === match.id);
            const sanitizedMatch = sanitizeMatch(match);

            if (matchIndex === -1) {
                tournament.matches.push(sanitizedMatch);
            } else {
                tournament.matches[matchIndex] = sanitizedMatch;
            }

            await updateDoc(tournamentRef, { matches: removeUndefinedValues(tournament.matches.map(sanitizeMatch)) });
        } catch (error) {
            console.error('Error updating match:', error);
            throw error;
        }
    },

    async addTeam(tournamentId: string, teamDetails: TeamDetails): Promise<void> {
        try {
            const tournamentRef = doc(db, 'tournaments', tournamentId);
            const tournamentSnap = await getDoc(tournamentRef);

            if (!tournamentSnap.exists()) {
                throw new Error('Tournament not found');
            }

            const tournament = {
                ...tournamentSnap.data(),
                id: tournamentSnap.id
            } as Tournament;

            const teamRef: Team = { id: teamDetails.id, name: teamDetails.name };

            tournament.teams.push(teamRef);
            tournament.teamDetails.push(teamDetails);

            await updateDoc(tournamentRef, removeUndefinedValues({
                teams: tournament.teams.map(toTeamRef),
                teamDetails: tournament.teamDetails
            }));
        } catch (error) {
            console.error('Error adding team:', error);
            throw error;
        }
    },

    async removeTeam(tournamentId: string, teamId: string): Promise<void> {
        try {
            const tournamentRef = doc(db, 'tournaments', tournamentId);
            const tournamentSnap = await getDoc(tournamentRef);

            if (!tournamentSnap.exists()) {
                throw new Error('Tournament not found');
            }

            const tournament = {
                ...tournamentSnap.data(),
                id: tournamentSnap.id
            } as Tournament;

            tournament.teams = tournament.teams.filter(team => team.id !== teamId);
            tournament.teamDetails = tournament.teamDetails.filter(team => team.id !== teamId);

            await updateDoc(tournamentRef, removeUndefinedValues({
                teams: tournament.teams.map(toTeamRef),
                teamDetails: tournament.teamDetails
            }));
        } catch (error) {
            console.error('Error removing team:', error);
            throw error;
        }
    }
};
