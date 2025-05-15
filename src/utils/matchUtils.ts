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