import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where } from 'firebase/firestore';
import { Tournament, Match, Team } from '../types';
import { db } from '../config/firebase';

// Enhanced debugging to verify Firestore connection
console.log('Verifying Firestore connection...');
getDocs(collection(db, 'tournaments'))
    .then(() => console.log('✅ Firestore connection verified'))
    .catch(error => console.error('❌ Firestore connection failed:', error));

export const databaseService = {
    async saveTournament(tournament: Tournament): Promise<void> {
        console.log('Attempting to save tournament:', tournament.id);
        try {
            const tournamentRef = doc(db, 'tournaments', tournament.id);
            await setDoc(tournamentRef, { ...tournament });
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
            return tournaments;
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
            return {
                ...tournamentSnap.data(),
                id: tournamentSnap.id
            } as Tournament;
        } catch (error) {
            console.error('Error getting tournament:', error);
            throw error;
        }
    },

    async updateTournament(tournament: Tournament): Promise<void> {
        try {
            const tournamentRef = doc(db, 'tournaments', tournament.id);
            await updateDoc(tournamentRef, { ...tournament });
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

            if (matchIndex === -1) {
                tournament.matches.push(match);
            } else {
                tournament.matches[matchIndex] = match;
            }

            await updateDoc(tournamentRef, { matches: tournament.matches });
        } catch (error) {
            console.error('Error updating match:', error);
            throw error;
        }
    },

    async addTeam(tournamentId: string, team: Team): Promise<void> {
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

            tournament.teams.push(team);
            await updateDoc(tournamentRef, { teams: tournament.teams });
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
            await updateDoc(tournamentRef, { teams: tournament.teams });
        } catch (error) {
            console.error('Error removing team:', error);
            throw error;
        }
    }
}; 