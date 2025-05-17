export type TournamentStage = 'league' | 'qualifier' | 'final';
export type TournamentStatus = 'upcoming' | 'ongoing' | 'completed';
export type MatchType = 'league' | 'qualifier' | 'final' | 'super_duper_over';
export type MatchStatus = 'scheduled' | 'ongoing' | 'completed' | 'tied';
export type MatchOutcome = 'win' | 'loss' | 'tie';

export interface Team {
    id: string;
    name: string;
    logo: string;
}

export interface Score {
    runs: number;
    wickets: number;
    overs: number;
}

export interface MatchResult {
    winner?: Team;  // undefined in case of a tie
    team1Score: Score;
    team2Score: Score;
    result: MatchOutcome;  // Using the MatchOutcome type
    superDuperOverId?: string;  // Reference to the super duper over match if created
    runRates?: {
        team1: number;
        team2: number;
    };
}

export type TossDecision = 'bat' | 'bowl';

export interface InningsInfo {
    tossWinner: Team;
    tossDecision: TossDecision;
    battingFirst: Team;
    date: Date;
    time: string;
}

export interface Match {
    id: string;
    matchNumber?: number;
    team1: Team;
    team2: Team;
    date?: Date;
    time?: string;
    venue: string;
    result?: MatchResult;
    matchType: MatchType;
    status: MatchStatus;
    parentMatchId?: string;
    isSuperDuperOver?: boolean;
    inningsInfo?: InningsInfo;
}

export interface TeamStats {
    team: Team;
    matches: number;
    wins: number;
    losses: number;
    ties: number;
    points: number;
    nrr: number;
    lastFive: ('W' | 'L' | 'T')[];
    runsScored: number;
    runsConceded: number;
    oversPlayed: number;
    oversBowled: number;
    wicketsTaken: number;
}

export interface Tournament {
    id: string;
    name: string;
    teams: Team[];
    matches: Match[];
    matchesCompleted: number;
    status: 'upcoming' | 'ongoing' | 'completed';
    currentStage: TournamentStage;
    pointsTable: TeamStats[];
    config: {
        matchesPerTeamPair: number;
    };
}

export interface TournamentConfig {
    matchesPerTeamPair: number;
}

export interface ScoreboardData {
    teams: {
        name: string;
        score: {
            runs: number;
            wickets: number;
            overs: number;
        };
        players: Array<{
            name: string;
            runs?: number;
            balls?: number;
            wickets?: number;
            economy?: number;
        }>;
    }[];
    result: string;
}

export interface TeamMapping {
    screenTeamName: string;
    actualTeam: Team;
}

export interface FirestoreDocument {
    id: string;             // The document ID
    [key: string]: any;     // All other fields from the document
}
