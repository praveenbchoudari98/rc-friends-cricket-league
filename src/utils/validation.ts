import type { Team } from '../types';

export const validateTeamName = (teams: Team[], newTeamName: string, currentTeamId?: string): boolean => {
  const normalizedNewName = newTeamName.trim().toLowerCase();
  return !teams.some(team => 
    team.name.trim().toLowerCase() === normalizedNewName && team.id !== currentTeamId
  );
};

export const getTeamNameError = (teams: Team[], newTeamName: string, currentTeamId?: string): string => {
  if (!newTeamName.trim()) {
    return 'Team name is required';
  }
  
  if (!validateTeamName(teams, newTeamName, currentTeamId)) {
    return 'Team name already exists';
  }
  
  return '';
}; 