import type { Match, Team, TeamStats } from '../types';
import { getSortedMatchData } from './matchUtils';

const POINTS_FOR_WIN = 2;
const POINTS_FOR_LOSS = 0;
const POINTS_FOR_TIE = 1;

const getFirstName = (fullName: string) => fullName.split(" ")[0];


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
            oversBowled: 0,
            wicketsTaken: 0,
            numOfFiftyPlusScores: 0,
            numofFivePlusWickets: 0,
            bestBattingPerformance: null,
            bestBowlingPerformance: null
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

        const team1Score = match.result.team1Score;
        const team2Score = match.result.team2Score;

        const team1OpponentName = getFirstName(match.team2.name);
        const team2OpponentName = getFirstName(match.team1.name);
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
        team1Stats.lastFive = team1Stats.lastFive.slice(0, 5)
        team2Stats.lastFive = team2Stats.lastFive.slice(0, 5);

        // Update runs and overs for NRR calculation
        team1Stats.runsScored += match.result!.team1Score.runs;
        team1Stats.runsConceded += match.result!.team2Score.runs;
        team1Stats.oversPlayed += match.result!.team1Score.overs;
        team1Stats.oversBowled += match.result!.team2Score.overs;
        team1Stats.wicketsTaken += match.result!.team2Score.wickets;

        team2Stats.runsScored += match.result!.team2Score.runs;
        team2Stats.runsConceded += match.result!.team1Score.runs;
        team2Stats.oversPlayed += match.result!.team2Score.overs;
        team2Stats.oversBowled += match.result!.team1Score.overs;
        team2Stats.wicketsTaken += match.result!.team1Score.wickets;
        team1Stats.numOfFiftyPlusScores += match.result.team1Score.runs >= 50 ? 1 : 0;
        team2Stats.numOfFiftyPlusScores += match.result.team2Score.runs >= 50 ? 1 : 0;
        team1Stats.numofFivePlusWickets += match.result.team2Score.wickets >= 5 ? 1 : 0;
        team2Stats.numofFivePlusWickets += match.result.team1Score.wickets >= 5 ? 1 : 0;

        if (
            !team1Stats.bestBattingPerformance ||
            team1Score?.runs > team1Stats.bestBattingPerformance.runs
        ) {
            team1Stats.bestBattingPerformance = { ...team1Score,opponent:team1OpponentName };
        }

        if (
            !team2Stats.bestBattingPerformance ||
            team2Score.runs > team2Stats.bestBattingPerformance.runs
        ) {
            team2Stats.bestBattingPerformance = { ...team2Score, opponent: team2OpponentName };
        }

        // === Best Bowling === (opponent's innings)
        const econ1 = team2Score.runs / team2Score.overs;
        const econ2 = team1Score.runs / team1Score.overs;

        const prevBowling1 = team1Stats.bestBowlingPerformance;
        if (
            !prevBowling1 ||
            team2Score.wickets > prevBowling1.wickets ||
            (team2Score.wickets === prevBowling1.wickets &&
                econ1 < (prevBowling1.runs / prevBowling1.overs))
        ) {
            team1Stats.bestBowlingPerformance = { ...team2Score, opponent: team1OpponentName };
        }

        const prevBowling2 = team2Stats.bestBowlingPerformance;
        if (
            !prevBowling2 ||
            team1Score.wickets > prevBowling2.wickets ||
            (team1Score.wickets === prevBowling2.wickets &&
                econ2 < (prevBowling2.runs / prevBowling2.overs))
        ) {
            team2Stats.bestBowlingPerformance = { ...team1Score, opponent: team2OpponentName };
        }



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