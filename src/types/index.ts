export interface Team {
    id: string;
    name: string;
    captain: string;
    players?: string[];
    logo: string;
}

export type TossDecision = 'bat' | 'bowl';

export type Score = {
    runs: number;
    wickets: number;
    overs: number;
};

export type MatchOutcome = 'win' | 'tie';

export type Match = {
    id: string;
    team1: Team;
    team2: Team;
    date?: Date;
    time?: string;
    venue?: string;
    status: 'scheduled' | 'completed';
    matchNumber?: number;
    inningsInfo?: {
        tossWinner: Team;
        tossDecision: TossDecision;
        battingFirst: Team;
    date: Date;
        time: string;
    };
    result?: {
        winner?: Team;
        team1Score: Score;
        team2Score: Score;
        result: MatchOutcome;
    };
};

export interface MatchResult {
    winner: Team;
    team1Score: {
        runs: number;
        wickets: number;
        overs: number;
    };
    team2Score: {
        runs: number;
        wickets: number;
        overs: number;
    };
}

export interface TeamStats {
    team: Team;
    matches: number;
    wins: number;
    losses: number;
    points: number;
    nrr: number;
    runsScored: number;
    runsConceded: number;
    oversPlayed: number;
    oversBowled: number;
}

export type TournamentStage = 'league' | 'qualifier' | 'final';

export interface Tournament {
    id: string;
    name: string;
    teams: Team[];
    matches: Match[];
    status: 'upcoming' | 'ongoing' | 'completed';
    currentStage: TournamentStage;
    pointsTable: TeamStats[];
    config: {
        matchesPerTeamPair: number;
    };
} 