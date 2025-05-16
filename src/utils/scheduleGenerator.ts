import type { Team, Match } from '../types';
import { generateUUID } from './uuid';

export const generateLeagueSchedule = (teams: Team[], matchesPerTeamPair: number = 1): Match[] => {
    const matches: Match[] = [];
    
    // Generate matches between each pair of teams
    for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
            // Generate matches based on matchesPerTeamPair
            for (let k = 0; k < matchesPerTeamPair; k++) {
                // For even number of matches between teams, alternate home and away
                // For odd number of matches, use home/away based on match number
                const isHome = k % 2 === 0;

                matches.push({
                    id: generateUUID(),
                    team1: isHome ? teams[i] : teams[j],
                    team2: isHome ? teams[j] : teams[i],
                    matchType: 'league',
                    status: 'scheduled',
                    venue: 'Wankhede Stadium, Mumbai',
                    date: new Date() // Add default date
                });

                // For odd numbers of matches per pair, add reverse fixture
                if (k === matchesPerTeamPair - 1 && matchesPerTeamPair % 2 !== 0) {
                    matches.push({
                        id: generateUUID(),
                        team1: !isHome ? teams[i] : teams[j],
                        team2: !isHome ? teams[j] : teams[i],
                        matchType: 'league',
                        status: 'scheduled',
                        venue: 'Wankhede Stadium, Mumbai',
                        date: new Date() // Add default date
                    });
                }
            }
        }
    }

    // Shuffle the matches to randomize the schedule
    for (let i = matches.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [matches[i], matches[j]] = [matches[j], matches[i]];
    }

    // Distribute dates evenly across matches
    const startDate = new Date();
    matches.forEach((match, index) => {
        const matchDate = new Date(startDate);
        matchDate.setDate(startDate.getDate() + Math.floor(index / 2)); // Two matches per day
        matchDate.setHours(index % 2 === 0 ? 14 : 19); // First match at 2 PM, second at 7 PM
        match.date = matchDate;
    });

    return matches;
};

export const generateKnockoutMatches = (
    team1: Team,
    team2: Team,
    matchType: 'qualifier' | 'final'
): Match => {
    return {
        id: generateUUID(),
        team1,
        team2,
        matchType,
        status: 'scheduled',
        venue: 'Wankhede Stadium, Mumbai',
        date: new Date() // Add default date
    };
}; 