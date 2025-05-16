export interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  teams: Team[];
  matches?: Match[];
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface Team {
  id: string;
  name: string;
  players: Player[];
}

export interface Player {
  id: string;
  name: string;
  role?: string;
}

export interface Match {
  id: string;
  team1Id: string;
  team2Id: string;
  date: string;
  venue?: string;
  result?: MatchResult;
  status: 'scheduled' | 'ongoing' | 'completed';
}

export interface MatchResult {
  winnerId: string;
  team1Score?: number;
  team2Score?: number;
  summary?: string;
} 