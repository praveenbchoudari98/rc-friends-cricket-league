import { generateLeagueSchedule } from './scheduleGenerator';
import type { Team } from '../types';

describe('generateLeagueSchedule', () => {
    const teams: Team[] = [
        { id: 'team1', name: 'Team A', logo: 'logoA' },
        { id: 'team2', name: 'Team B', logo: 'logoB' },
        { id: 'team3', name: 'Team C', logo: 'logoC' }
    ];

    test('generates correct number of matches for single match per pair', () => {
        const matches = generateLeagueSchedule(teams, 1);
        expect(matches.length).toBe(3); // 3C2 = 3 pairs * 1 match each
        
        // Count matches between each pair
        const pairCounts = new Map<string, number>();
        matches.forEach(match => {
            const pair = [match.team1.id, match.team2.id].sort().join('-');
            pairCounts.set(pair, (pairCounts.get(pair) || 0) + 1);
        });
        
        expect(pairCounts.get('team1-team2')).toBe(1);
        expect(pairCounts.get('team2-team3')).toBe(1);
        expect(pairCounts.get('team1-team3')).toBe(1);
    });

    test('generates correct home/away pattern for even number of matches', () => {
        const matches = generateLeagueSchedule(teams, 2);
        expect(matches.length).toBe(6); // 3C2 = 3 pairs * 2 matches each
        
        // Group matches by team pairs
        const pairMatches = new Map<string, Array<{home: string, away: string}>>();
        matches.forEach(match => {
            const pair = [match.team1.id, match.team2.id].sort().join('-');
            if (!pairMatches.has(pair)) {
                pairMatches.set(pair, []);
            }
            pairMatches.get(pair)?.push({
                home: match.team1.id,
                away: match.team2.id
            });
        });

        // Verify each pair has alternating home/away matches
        pairMatches.forEach((matches, pair) => {
            expect(matches.length).toBe(2);
            const [match1, match2] = matches;
            expect(match1.home).not.toBe(match2.home);
            expect(match1.away).not.toBe(match2.away);
        });
    });

    test('generates correct number of matches for three matches per pair', () => {
        const matches = generateLeagueSchedule(teams, 3);
        expect(matches.length).toBe(9); // 3C2 = 3 pairs * 3 matches each
        
        // Count matches between each pair
        const pairCounts = new Map<string, number>();
        matches.forEach(match => {
            const pair = [match.team1.id, match.team2.id].sort().join('-');
            pairCounts.set(pair, (pairCounts.get(pair) || 0) + 1);
        });
        
        expect(pairCounts.get('team1-team2')).toBe(3);
        expect(pairCounts.get('team2-team3')).toBe(3);
        expect(pairCounts.get('team1-team3')).toBe(3);
    });
}); 