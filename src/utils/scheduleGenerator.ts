import type { Team, Match } from '../types';

export const generateLeagueSchedule = (teams: Team[], matchesPerTeamPair: number = 1): Match[] => {
    const matches: Match[] = [];
    
    // Generate matches between each pair of teams
    for (let i = 0; i < teams.length; i++) {
        for (let j = i + 1; j < teams.length; j++) {
            // Generate matches based on matchesPerTeamPair
            for (let k = 0; k < matchesPerTeamPair; k++) {
                // For even number of matches, alternate home and away
                // For odd number of matches, randomize home/away for each match
                const isHome = matchesPerTeamPair % 2 === 0 ? 
                    k % 2 === 0 : // Alternate for even numbers
                    Math.random() < 0.5; // Random for odd numbers

                matches.push({
                    id: crypto.randomUUID(),
                    team1: isHome ? teams[i] : teams[j],
                    team2: isHome ? teams[j] : teams[i],
                    matchType: 'league',
                    status: 'scheduled',
                    venue: 'Wankhede Stadium, Mumbai'
                });
            }
        }
    }

    // Shuffle the matches to randomize the schedule
    for (let i = matches.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [matches[i], matches[j]] = [matches[j], matches[i]];
    }

    return matches;
};

export const generateKnockoutMatches = (
    team1: Team,
    team2: Team,
    matchType: 'qualifier' | 'final'
): Match => {
    return {
        id: crypto.randomUUID(),
        team1,
        team2,
        matchType,
        status: 'scheduled',
        venue: 'Wankhede Stadium, Mumbai'
    };
}; 