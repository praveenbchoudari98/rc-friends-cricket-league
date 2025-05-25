import React from 'react';
import { Box, Typography } from '@mui/material';
import { EmojiEvents as TrophyIcon } from '@mui/icons-material';
import type { Team } from '../../types';
import { getTeamLogo } from '../../utils/matchUtils';

// Array of cricket player avatar variations with different roles and colors
export const PLAYER_AVATARS = [
    // Batsman in blue
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iIzE5NzZEMiIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjRkZGRkZGIi8+PHBhdGggZD0iTTUwIDU1QzM4IDU1IDI4IDY1IDI4IDc4SDcyQzcyIDY1IDYyIDU1IDUwIDU1WiIgZmlsbD0iI0ZGRkZGRiIvPjxwYXRoIGQ9Ik02NSA0MEw4MCA1MEw3MCA2MEw2MCA1NUw2NSA0MFoiIGZpbGw9IiNGRkMxMDciIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+',
    // Fast bowler in red
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iI0Q4MjYyNiIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjRkZGRkZGIi8+PHBhdGggZD0iTTUwIDU1QzM4IDU1IDI4IDY1IDI4IDc4SDcyQzcyIDY1IDYyIDU1IDUwIDU1WiIgZmlsbD0iI0ZGRkZGRiIvPjxwYXRoIGQ9Ik0zNSA0MEwyMCA1MEwzMCA2MEw0MCA1NUwzNSA0MFoiIGZpbGw9IiNGRkMxMDciIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+',
    // Spin bowler in green
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iIzJFN0QzMiIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjRkZGRkZGIi8+PHBhdGggZD0iTTUwIDU1QzM4IDU1IDI4IDY1IDI4IDc4SDcyQzcyIDY1IDYyIDU1IDUwIDU1WiIgZmlsbD0iI0ZGRkZGRiIvPjxwYXRoIGQ9Ik0zNSA0NUMyNSA0MCAzMCAzMCA0MCAzNUM0NSA0MCA0MCA1MCAzNSA0NVoiIGZpbGw9IiNGRkMxMDciIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+',
    // Wicket keeper in purple
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iIzlDMjdCMCIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjRkZGRkZGIi8+PHBhdGggZD0iTTUwIDU1QzM4IDU1IDI4IDY1IDI4IDc4SDcyQzcyIDY1IDYyIDU1IDUwIDU1WiIgZmlsbD0iI0ZGRkZGRiIvPjxwYXRoIGQ9Ik00MCA2MEg2MEw1MCA3MEw0MCA2MFoiIGZpbGw9IiNGRkMxMDciIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+',
    // Captain in orange with star
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI0NSIgZmlsbD0iI0ZGOTgwMCIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iMzUiIHI9IjE1IiBmaWxsPSIjRkZGRkZGIi8+PHBhdGggZD0iTTUwIDU1QzM4IDU1IDI4IDY1IDI4IDc4SDcyQzcyIDY1IDYyIDU1IDUwIDU1WiIgZmlsbD0iI0ZGRkZGRiIvPjxwYXRoIGQ9Ik01MCAyMEw1NSAzMEw2NSAzMkw1OCA0MEw2MCA1MEw1MCA0NUw0MCA1MEw0MiA0MEwzNSAzMkw0NSAzMEw1MCAyMFoiIGZpbGw9IiNGRkMxMDciIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+'
];

// Function to get avatar based on team ID
export const getTeamAvatar = (teamId: string): string => {
    // For first 5 teams, assign unique avatars
    const existingIndex = parseInt(teamId) - 1;
    if (existingIndex >= 0 && existingIndex < PLAYER_AVATARS.length) {
        return PLAYER_AVATARS[existingIndex];
    }
    
    // For additional teams, use the hash-based distribution
    const index = teamId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % PLAYER_AVATARS.length;
    return PLAYER_AVATARS[index];
};

interface TeamCardProps {
    team?: Team;
    isWinner?: boolean;
    qualificationText?: string;
}

export const TeamCard: React.FC<TeamCardProps> = ({ 
    team, 
    isWinner = false,
    qualificationText = ''
}) => (
    <Box
        sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '30px',
            p: '8px 16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            border: '1px solid rgba(0,0,0,0.1)',
            width: '100%',
            maxWidth: 300,
            position: 'relative',
            overflow: 'hidden',
            '&::before': isWinner ? {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(90deg, rgba(255,140,0,0.1) 0%, rgba(255,140,0,0) 100%)',
                zIndex: 0
            } : {}
        }}
    >
        <Box
            component="img"
            src={getTeamLogo(team.id) || (team?.id ? getTeamAvatar(team.id) : PLAYER_AVATARS[0])}
            alt={team?.name || 'Team Logo'}
            sx={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: '2px solid #f0f0f0',
                padding: '2px',
                backgroundColor: 'white',
                zIndex: 1,
                objectFit: 'contain'
            }}
        />
        <Box sx={{ flex: 1, zIndex: 1 }}>
            <Typography
                sx={{
                    fontWeight: 600,
                    color: '#001838',
                    fontSize: '0.9rem'
                }}
            >
                {team?.name || 'TBD'}
            </Typography>
            {qualificationText && (
                <Typography
                    sx={{
                        color: 'rgba(0,0,0,0.6)',
                        fontSize: '0.75rem',
                        fontStyle: 'italic'
                    }}
                >
                    {qualificationText}
                </Typography>
            )}
        </Box>
        {isWinner && (
            <TrophyIcon 
                sx={{ 
                    position: 'absolute',
                    right: 12,
                    color: '#FFD700',
                    fontSize: 20,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
                    zIndex: 1
                }}
            />
        )}
    </Box>
); 