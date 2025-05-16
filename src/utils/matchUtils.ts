import { format } from 'date-fns';
import type { Match, Team } from '../types';

export const getVictoryMargin = (match: Match): string => {
    if (!match.result) {
        return '';
    }

    if (!match.result.winner) {
        return 'Match Tied';
    }

    if (!match.inningsInfo) {
        return '';
    }

    const { team1, team2 } = match;
    const { team1Score, team2Score, winner } = match.result;
    const { battingFirst } = match.inningsInfo;

    const battingFirstScore = battingFirst.id === team1.id ? team1Score : team2Score;
    const battingSecondScore = battingFirst.id === team1.id ? team2Score : team1Score;

    if (winner.id === battingFirst.id) {
        return `won by ${battingFirstScore.runs - battingSecondScore.runs} runs`;
    } else {
        return `won by ${10 - battingSecondScore.wickets} wickets`;
    }
};
interface FirestoreTimestamp {
    seconds: number;
    nanoseconds: number;
}

export const getFormattedDate = (matchDate: Date): string => {
    const rawDate = matchDate as FirestoreTimestamp | Date;

    let date: Date;

    if (rawDate instanceof Date) {
        date = rawDate;
    } else if (rawDate && typeof rawDate.seconds === 'number') {
        date = new Date(rawDate.seconds * 1000);
    } else {
        date = new Date(); // fallback if missing
    }

    // Convert from UTC to IST by adding 5.5 hours
    const istDate = new Date(date.getTime() + 330 * 60000);

    // Format with date-fns
    const formattedDate = format(istDate, 'dd MMM yyyy');
    return formattedDate
}

const toMillis = (date: any): number => {
    if (!date) return 0;
    if (date instanceof Date) return date.getTime();
    if (typeof date.seconds === 'number') {
        return date.seconds * 1000 + Math.floor((date.nanoseconds || 0) / 1_000_000);
    }
    return new Date(date).getTime(); // fallback, in case it's a string
};
export const getSortedMatchData = (matches: Match[]): Match[] => {
    return matches.sort((a, b) => {
        return toMillis(b.date) - toMillis(a.date); // Most recent first
    });
}