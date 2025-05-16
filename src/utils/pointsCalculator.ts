import type { Match, Team, TeamStats } from '../types';
import { getSortedMatchData } from './matchUtils';

const POINTS_FOR_WIN = 2;
const POINTS_FOR_LOSS = 0;
const POINTS_FOR_TIE = 1;

export const calculateTeamStats = (team: Team, matches: Match[]): TeamStats => {
    const teamMatches = matches.filter(
        match => (match.team1.id === team.id || match.team2.id === team.id) && match.result
    );

    let wins = 0;
    let losses = 0;
    let ties = 0;
    let runsScored = 0;
    let runsConceded = 0;
    let oversPlayed = 0;
    let oversBowled = 0;
    let lastFive: ('W' | 'L' | 'T')[] = [];

    getSortedMatchData(teamMatches).forEach(match => {
        const result = match.result;
        if (!result) return;

        const isTeam1 = match.team1.id === team.id;
        const teamScore = isTeam1 ? result.team1Score : result.team2Score;
        const opposingScore = isTeam1 ? result.team2Score : result.team1Score;

        // Only count regular matches for points and stats, not super duper overs
        if (!match.isSuperDuperOver) {
            if (result.result === 'tie') {
                ties++;
                lastFive.push('T');
            } else if (result.winner && result.winner.id === team.id) {
                wins++;
                lastFive.push('W');
            } else {
                losses++;
                lastFive.push('L');
            }

            runsScored += teamScore.runs;
            runsConceded += opposingScore.runs;
            oversPlayed += teamScore.overs;
            oversBowled += opposingScore.overs;
        }
    });

    // Keep only the last 5 matches
    lastFive = lastFive.slice(-5);

    const points = (wins * POINTS_FOR_WIN) + (losses * POINTS_FOR_LOSS) + (ties * POINTS_FOR_TIE);

    // Calculate Net Run Rate
    // For tied matches, the NRR impact is neutral (0)
    const netRunRate = oversPlayed > 0 && oversBowled > 0 ?
        (runsScored / oversPlayed) - (runsConceded / oversBowled) : 0;

    return {
        team,
        matches: teamMatches.filter(m => !m.isSuperDuperOver).length,
        wins,
        losses,
        ties,
        points,
        nrr: netRunRate,
        lastFive,
        runsScored,
        runsConceded,
        oversPlayed,
        oversBowled
    };
};

export function generatePointsTable(teams: Team[], matches: Match[]): TeamStats[] {
    const stats = new Map<string, TeamStats>();
    const sortedmatches = getSortedMatchData(matches)

    // Initialize stats for all teams
    teams.forEach(team => {
        stats.set(team.id, {
            team,
            matches: 0,
            wins: 0,
            losses: 0,
            ties: 0,
            points: 0,
            nrr: 0,
            lastFive: [],
            runsScored: 0,
            runsConceded: 0,
            oversPlayed: 0,
            oversBowled: 0
        });
    });

    // Calculate stats from completed matches
    sortedmatches.filter(match =>
        match.status === 'completed' &&
        match.result &&
        stats.has(match.team1.id) &&
        stats.has(match.team2.id)
    ).forEach(match => {
        const team1Stats = stats.get(match.team1.id)!;
        const team2Stats = stats.get(match.team2.id)!;

        // Update matches played
        team1Stats.matches++;
        team2Stats.matches++;

        // Update wins, losses, ties and points
        if (match.result!.result === 'tie') {
            team1Stats.ties++;
            team2Stats.ties++;
            team1Stats.points += POINTS_FOR_TIE;
            team2Stats.points += POINTS_FOR_TIE;
            team1Stats.lastFive.push('T');
            team2Stats.lastFive.push('T');
        } else if (match.result!.winner && match.result!.winner.id === match.team1.id) {
            team1Stats.wins++;
            team1Stats.points += POINTS_FOR_WIN;
            team2Stats.losses++;
            team1Stats.lastFive.push('W');
            team2Stats.lastFive.push('L');
        } else if (match.result!.winner) {
            team2Stats.wins++;
            team2Stats.points += POINTS_FOR_WIN;
            team1Stats.losses++;
            team1Stats.lastFive.push('L');
            team2Stats.lastFive.push('W');
        }

        // Keep only last 5 matches
        team1Stats.lastFive = team1Stats.lastFive.slice(-5);
        team2Stats.lastFive = team2Stats.lastFive.slice(-5);

        // Update runs and overs for NRR calculation
        team1Stats.runsScored += match.result!.team1Score.runs;
        team1Stats.runsConceded += match.result!.team2Score.runs;
        team1Stats.oversPlayed += match.result!.team1Score.overs;
        team1Stats.oversBowled += match.result!.team2Score.overs;

        team2Stats.runsScored += match.result!.team2Score.runs;
        team2Stats.runsConceded += match.result!.team1Score.runs;
        team2Stats.oversPlayed += match.result!.team2Score.overs;
        team2Stats.oversBowled += match.result!.team1Score.overs;
    });

    // Calculate NRR for each team
    stats.forEach(teamStats => {
        if (teamStats.oversPlayed > 0 && teamStats.oversBowled > 0) {
            const runsPerOver = teamStats.runsScored / teamStats.oversPlayed;
            const runsConcededPerOver = teamStats.runsConceded / teamStats.oversBowled;
            teamStats.nrr = Number((runsPerOver - runsConcededPerOver).toFixed(3));
        }
    });

    // Convert to array and sort by points, then NRR
    return Array.from(stats.values()).sort((a, b) => {
        if (b.points !== a.points) {
            return b.points - a.points;
        }
        return b.nrr - a.nrr;
    });
} 