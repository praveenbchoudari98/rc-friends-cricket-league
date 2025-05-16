import React from 'react';
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Paper, Avatar } from '@mui/material';
import { 
    EmojiEvents as TrophyIcon, 
    EmojiEvents as QualifierIcon, 
    Stars as FinalIcon, 
    QuestionMark as QuestionMarkIcon,
    Looks as SecondIcon,
    Filter3 as ThirdIcon,
    LooksOne as FirstIcon,
    SportsKabaddi as VersusIcon,
    Pending as QualifierWinnerIcon
} from '@mui/icons-material';
import { Celebration as CelebrationIcon } from '@mui/icons-material';
import type { Match, Team, TeamStats, MatchType, MatchStatus, TournamentStage } from '../../types';
import { TeamCard } from './TeamCard';
import { MatchCard as MatchCardComponent } from '../Matches/MatchCard';

interface KnockoutStageProps {
    matches: Match[];
    pointsTable: TeamStats[];
    onMatchUpdate: (match: Match) => void;
    currentStage: TournamentStage;
}

export const KnockoutStage: React.FC<KnockoutStageProps> = ({ 
    matches, 
    pointsTable, 
    onMatchUpdate, 
    currentStage 
}: KnockoutStageProps) => {
    // Add animation trigger state
    const [animate, setAnimate] = React.useState(false);

    // Trigger animation on mount
    React.useEffect(() => {
        const timer = setTimeout(() => setAnimate(true), 500);
        return () => clearTimeout(timer);
    }, []);

    // Check if all league matches are completed
    const leagueMatches = matches.filter((m: Match) => m.matchType === 'league');
    const allLeagueMatchesCompleted = leagueMatches.length > 0 && 
        leagueMatches.every((m: Match) => m.status === 'completed' || m.status === 'tied');

    const getQualificationText = (matchType: MatchType, teamIndex: 1 | 2): string => {
        if (!pointsTable || pointsTable.length === 0 || !allLeagueMatchesCompleted) return 'TBD';
        
        if (matchType === ('qualifier' as MatchType)) {
            if (teamIndex === 1) {
                const team = pointsTable[1]?.team;
                return team ? `${team.name}` : '2nd Position';
            } else {
                const team = pointsTable[2]?.team;
                return team ? `${team.name}` : '3rd Position';
            }
        } else if (matchType === 'final') {
            if (teamIndex === 1) {
                const team = pointsTable[0]?.team;
                return team ? `${team.name}` : '1st Position';
            }
            return 'Qualifier Winner';
        }
        return 'TBD';
    };

    // Create a data URL for the TBD avatar
    const tbdAvatarUrl = React.useMemo(() => {
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            // Draw circle background
            ctx.fillStyle = '#EEEEEE';
            ctx.beginPath();
            ctx.arc(50, 50, 45, 0, Math.PI * 2);
            ctx.fill();

            // Draw question mark
            ctx.fillStyle = '#999999';
            ctx.font = 'bold 60px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('?', 50, 50);
        }
        return canvas.toDataURL();
    }, []);

    // Create placeholder matches if they don't exist
    const placeholderTeam: Team = {
        id: 'tbd',
        name: 'TBD',
        logo: tbdAvatarUrl
    };

    // Get teams based on points table positions
    const getTeamByPosition = (position: number): Team => {
        if (allLeagueMatchesCompleted && pointsTable && pointsTable.length > position) {
            return pointsTable[position].team;
        }
        return placeholderTeam;
    };

    // Get playoff matches
    const qualifierMatch = matches.find((m: Match) => m.matchType === ('qualifier' as MatchType)) || {
        id: 'placeholder-qualifier',
        team1: allLeagueMatchesCompleted ? pointsTable[1]?.team : placeholderTeam,
        team2: allLeagueMatchesCompleted ? pointsTable[2]?.team : placeholderTeam,
        matchType: 'qualifier' as MatchType,
        status: 'scheduled' as MatchStatus,
        venue: 'TBD'
    } as Match;
    
    const finalMatch = matches.find((m: Match) => m.matchType === 'final') || {
        id: 'placeholder-final',
        team1: allLeagueMatchesCompleted ? pointsTable[0]?.team : placeholderTeam,
        team2: placeholderTeam, // Will be qualifier winner
        matchType: 'final',
        status: 'scheduled',
        venue: 'TBD'
    } as Match;
    
    // Get super duper over matches
    const qualifierSuperDuperOvers = matches
        .filter((m: Match) => m.matchType === 'super_duper_over' && m.parentMatchId === qualifierMatch.id)
        .sort((a: Match, b: Match) => (a.date?.getTime() || 0) - (b.date?.getTime() || 0));

    const finalSuperDuperOvers = matches
        .filter((m: Match) => m.matchType === 'super_duper_over' && m.parentMatchId === finalMatch.id)
        .sort((a: Match, b: Match) => (a.date?.getTime() || 0) - (b.date?.getTime() || 0));

    // Filter matches for display
    const displayMatches = matches.filter((m: Match) => 
        m.matchType === ('qualifier' as MatchType) || 
        m.matchType === 'final' || 
        m.matchType === 'super_duper_over'
    );
    
    const winner = finalMatch?.result?.winner || finalSuperDuperOvers[finalSuperDuperOvers.length - 1]?.result?.winner;
    const finalMatchTied = finalMatch?.status === 'tied' && !finalSuperDuperOvers.find((m: Match) => m.result?.winner);
    const tournamentComplete = Boolean(winner);

    const formatDate = (date?: Date | string) => {
        if (!date) return '';
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            if (isNaN(dateObj.getTime())) return '';
            
            return new Intl.DateTimeFormat('en-US', { 
                month: 'short', 
                day: 'numeric' 
            }).format(dateObj);
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    };

    const KnockoutMatchCard = ({ 
        match, 
        title,
        matchType,
        superDuperOvers = [],
        onUpdate
    }: { 
        match?: Match, 
        title: string,
        matchType: 'qualifier' | 'final',
        superDuperOvers?: Match[],
        onUpdate: (updatedMatch: Match) => void
    }) => {
        // Create a wrapped update function that handles both match updates and super duper overs
        const handleUpdate = React.useCallback((updatedMatch: Match) => {
            if (onUpdate) {
                onUpdate(updatedMatch);
            }
        }, [onUpdate]);

        return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                width: '100%',
                maxWidth: 320,
                position: 'relative'
            }}
        >
            <Box 
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1,
                    position: 'relative',
                    mb: 1,
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        bottom: -8,
                        left: '10%',
                        width: '80%',
                        height: '2px',
                        background: 'linear-gradient(90deg, transparent, #FF8C00, transparent)',
                        animation: 'shimmer 2s infinite',
                    },
                    '@keyframes shimmer': {
                        '0%': { opacity: 0.4 },
                        '50%': { opacity: 1 },
                        '100%': { opacity: 0.4 }
                    }
                }}
            >
                {matchType === 'qualifier' ? (
                    <QualifierIcon 
                        sx={{ 
                            color: '#FF8C00',
                            fontSize: '28px',
                            animation: 'bounce 1s infinite',
                            '@keyframes bounce': {
                                '0%, 100%': { transform: 'translateY(0)' },
                                '50%': { transform: 'translateY(-5px)' }
                            }
                        }}
                    />
                ) : (
                    <FinalIcon 
                        sx={{ 
                            color: '#FFD700',
                            fontSize: '28px',
                            animation: 'rotate 2s infinite',
                            '@keyframes rotate': {
                                '0%': { transform: 'rotate(0deg)' },
                                '100%': { transform: 'rotate(360deg)' }
                            }
                        }}
                    />
                )}
                <Typography 
                    variant="h6" 
                    sx={{
                        color: matchType === 'qualifier' ? '#FF8C00' : '#FFD700',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                        animation: 'pulse 2s infinite',
                        '@keyframes pulse': {
                            '0%': { opacity: 0.8 },
                            '50%': { opacity: 1 },
                            '100%': { opacity: 0.8 }
                        }
                    }}
                >
                    {title}
                </Typography>
            </Box>

            {/* Team Position Indicators */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 2,
                mb: 1
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    color: matchType === 'qualifier' ? '#FF8C00' : '#FFD700'
                }}>
                    {matchType === 'qualifier' ? (
                        <>
                            <SecondIcon />
                            <Typography variant="body2" fontWeight="600">
                                2nd Position
                            </Typography>
                        </>
                    ) : (
                        <>
                            <FirstIcon />
                            <Typography variant="body2" fontWeight="600">
                                1st Position
                            </Typography>
                        </>
                    )}
                </Box>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    color: matchType === 'qualifier' ? '#FF8C00' : '#FFD700',
                    mx: 2
                }}>
                    <VersusIcon sx={{ 
                        fontSize: '24px',
                        animation: 'pulse 1.5s infinite',
                        '@keyframes pulse': {
                            '0%, 100%': { transform: 'scale(1)' },
                            '50%': { transform: 'scale(1.2)' }
                        }
                    }} />
                </Box>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    color: matchType === 'qualifier' ? '#FF8C00' : '#FFD700'
                }}>
                    {matchType === 'qualifier' ? (
                        <>
                            <ThirdIcon />
                            <Typography variant="body2" fontWeight="600">
                                3rd Position
                            </Typography>
                        </>
                    ) : (
                        <>
                            <QualifierWinnerIcon sx={{ 
                                animation: 'spin 2s linear infinite',
                                '@keyframes spin': {
                                    '0%': { transform: 'rotate(0deg)' },
                                    '100%': { transform: 'rotate(360deg)' }
                                }
                            }} />
                            <Typography variant="body2" fontWeight="600">
                                Qualifier Winner
                            </Typography>
                        </>
                    )}
                </Box>
            </Box>

            {/* Parent Match */}
            {match && (
                <MatchCardComponent 
                    match={match}
                    onUpdate={handleUpdate}
                    currentStage={currentStage}
                    readOnly={true}
                />
            )}

            {/* Super Duper Over Matches */}
            {superDuperOvers.length > 0 && (
                <Box sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                    pl: 4,
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        left: '10px',
                        top: 0,
                        bottom: 0,
                        width: '2px',
                        background: 'linear-gradient(to bottom, #FF8C00 0%, #E67E00 100%)',
                        borderRadius: '4px'
                    }
                }}>
                    {superDuperOvers.map((superDuperOver: Match, index: number) => (
                        <Box 
                            key={superDuperOver.id}
                            sx={{
                                p: 2,
                                bgcolor: 'white',
                                borderRadius: 2,
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                border: '1px solid rgba(0,0,0,0.1)',
                                position: 'relative',
                                '&::before': {
                                    content: '""',
                                    position: 'absolute',
                                    left: '-24px',
                                    top: '50%',
                                    width: '12px',
                                    height: '2px',
                                    background: 'linear-gradient(to right, #FF8C00 0%, #E67E00 100%)',
                                    borderRadius: '4px'
                                }
                            }}
                        >
                            <Typography 
                                variant="subtitle2" 
                                sx={{ 
                                    color: '#FF8C00',
                                    fontWeight: 600,
                                    mb: 1,
                                    textAlign: 'center'
                                }}
                            >
                                Super Duper Over {index + 1}
                                {superDuperOver.result?.winner && (
                                    <Typography 
                                        component="span" 
                                        sx={{ 
                                            ml: 1,
                                            color: 'success.main',
                                            fontSize: '0.8rem'
                                        }}
                                    >
                                        • Winner: {superDuperOver.result.winner.name}
                                    </Typography>
                                )}
                            </Typography>
                                <MatchCardComponent 
                                    match={superDuperOver}
                                    onUpdate={handleUpdate}
                                    currentStage={currentStage}
                                    readOnly={true}
                                />
            </Box>
                    ))}
                </Box>
            )}
        </Box>
    );
    };

    const WinnerShowcase = ({ team }: { team?: Team }) => {
        if (!team) return null;
        
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                    position: 'relative'
                }}
            >
                {/* Trophy Cup Image */}
                <Box
                    sx={{
                        width: 100,
                        height: 100,
                        position: 'relative',
                        mb: 2
                    }}
                >
                    <TrophyIcon 
                        sx={{ 
                            width: '100%',
                            height: '100%',
                            color: '#FFD700',
                            filter: 'drop-shadow(0 4px 12px rgba(255, 215, 0, 0.3))'
                        }}
                    />
                </Box>

                {/* Winner Team Card */}
                <Box
                    sx={{
                        backgroundColor: '#001838',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        boxShadow: '0 8px 32px rgba(255, 140, 0, 0.2)',
                        maxWidth: 320,
                        width: '100%'
                    }}
                >
                    <Box
                        sx={{
                            p: '12px 24px',
                            borderBottom: '1px solid rgba(255,255,255,0.1)',
                            backgroundColor: '#FF8C00'
                        }}
                    >
                        <Typography
                            sx={{
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                textAlign: 'center',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em'
                            }}
                        >
                            Tournament Winner
                        </Typography>
                    </Box>
                    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ position: 'relative' }}>
                            {/* Crown */}
                            <Box
                                sx={{
                                    position: 'absolute',
                                    top: -30,
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: 40,
                                    height: 40,
                                    backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\'%3E%3Cpath fill=\'%23FFD700\' d=\'M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V18H19V19Z\'/%3E%3C/svg%3E")',
                                    backgroundSize: 'contain',
                                    backgroundRepeat: 'no-repeat',
                                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
                                }}
                            />
                            {/* Team Logo */}
                            <Box
                                component="img"
                                src={team.logo}
                                alt={team.name}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: '50%',
                                    border: '4px solid #FF8C00',
                                    backgroundColor: 'white',
                                    padding: '8px',
                                    boxShadow: '0 4px 20px rgba(255, 140, 0, 0.3)'
                                }}
                            />
                        </Box>
                        <Typography
                            sx={{
                                color: 'white',
                                fontWeight: 700,
                                fontSize: '1.5rem',
                                textAlign: 'center'
                            }}
                        >
                            {team.name}
                        </Typography>
                    </Box>
                </Box>

                {/* Congratulations Message */}
                <Box
                    sx={{
                        mt: 4,
                        textAlign: 'center',
                        position: 'relative'
                    }}
                >
                    <CelebrationIcon 
                        sx={{ 
                            position: 'absolute',
                            top: -30,
                            left: -30,
                            color: '#FFD700',
                            fontSize: 40,
                            transform: 'rotate(-45deg)'
                        }}
                    />
                    <CelebrationIcon 
                        sx={{ 
                            position: 'absolute',
                            top: -30,
                            right: -30,
                            color: '#FFD700',
                            fontSize: 40,
                            transform: 'rotate(45deg)'
                        }}
                    />
                    <Typography
                        sx={{
                            color: '#FFD700',
                            fontWeight: 800,
                            fontSize: { xs: '1.5rem', md: '2rem' },
                            textTransform: 'uppercase',
                            letterSpacing: '0.1em',
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                            mb: 1
                        }}
                    >
                        Congratulations
                    </Typography>
                    <Typography
                        sx={{
                            color: 'white',
                            fontWeight: 700,
                            fontSize: { xs: '1.2rem', md: '1.5rem' },
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em'
                        }}
                    >
                        {team.name}
                    </Typography>
                    <Typography
                        sx={{
                            color: '#FF8C00',
                            fontWeight: 600,
                            fontSize: '1rem',
                            mt: 1
                        }}
                    >
                        RFCL25 Champions
                    </Typography>
                </Box>
            </Box>
        );
    };

    return (
        <Box 
            sx={{ 
                minHeight: '100vh',
                background: 'linear-gradient(135deg, rgba(0,24,56,0.97) 0%, rgba(0,24,56,0.95) 100%)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                p: { xs: 2, md: 4 },
                position: 'relative'
            }}
        >
            <Typography 
                variant="h4" 
                sx={{ 
                    textAlign: 'center', 
                    mb: { xs: 4, md: 6 },
                    color: 'white',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                }}
            >
                {finalMatchTied ? 'Tournament Tied' : (tournamentComplete ? 'Tournament Complete' : 'Road to the Finals')}
            </Typography>

            <Box 
                sx={{ 
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: '1fr',
                        md: winner ? '1fr 80px 1fr 80px 1fr' : '1fr 80px 1fr'
                    },
                    gap: { xs: 4, md: 2 },
                    maxWidth: 1400,
                    mx: 'auto',
                    position: 'relative',
                    alignItems: 'flex-start'
                }}
            >
                {/* Qualifier Match */}
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ 
                        opacity: 0,
                        transform: 'translateY(20px)',
                        animation: animate ? 'fadeInUp 0.6s ease forwards' : 'none',
                        '@keyframes fadeInUp': {
                            '0%': {
                                opacity: 0,
                                transform: 'translateY(20px)'
                            },
                            '100%': {
                                opacity: 1,
                                transform: 'translateY(0)'
                            }
                        }
                    }}>
                        <KnockoutMatchCard 
                            match={qualifierMatch}
                            title="QUALIFIER"
                            matchType="qualifier"
                            superDuperOvers={qualifierSuperDuperOvers}
                            onUpdate={onMatchUpdate}
                        />
                    </Box>
                </Box>

                {/* First Connector */}
                <Box 
                    sx={{ 
                        display: { xs: 'none', md: 'block' },
                        position: 'relative',
                        height: '2px',
                        backgroundColor: '#FF8C00',
                        width: '100%',
                        mt: '120px',
                        opacity: 0,
                        transform: 'scaleX(0)',
                        transformOrigin: 'left',
                        animation: animate ? 'flowRight 0.6s ease forwards 0.6s' : 'none',
                        '@keyframes flowRight': {
                            '0%': {
                                opacity: 0,
                                transform: 'scaleX(0)'
                            },
                            '100%': {
                                opacity: 1,
                                transform: 'scaleX(1)'
                            }
                        }
                    }}
                />

                {/* Final Match */}
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ 
                        opacity: 0,
                        transform: 'translateY(20px)',
                        animation: animate ? 'fadeInUp 0.6s ease forwards 1.2s' : 'none',
                        '@keyframes fadeInUp': {
                            '0%': {
                                opacity: 0,
                                transform: 'translateY(20px)'
                            },
                            '100%': {
                                opacity: 1,
                                transform: 'translateY(0)'
                            }
                        }
                    }}>
                        <KnockoutMatchCard 
                            match={finalMatch}
                            title="FINAL"
                            matchType="final"
                            superDuperOvers={finalSuperDuperOvers}
                            onUpdate={onMatchUpdate}
                        />
                    </Box>
                </Box>

                {winner && (
                    <>
                        {/* Second Connector */}
                        <Box 
                            sx={{ 
                                display: { xs: 'none', md: 'block' },
                                position: 'relative',
                                height: '2px',
                                backgroundColor: '#FF8C00',
                                width: '100%',
                                mt: '120px',
                                opacity: 0,
                                transform: 'scaleX(0)',
                                transformOrigin: 'left',
                                animation: animate ? 'flowRight 0.6s ease forwards 1.8s' : 'none'
                            }}
                        />

                        {/* Winner Showcase */}
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'center',
                            opacity: 0,
                            transform: 'translateY(20px)',
                            animation: animate ? 'fadeInUp 0.6s ease forwards 2.4s' : 'none'
                        }}>
                            <WinnerShowcase team={winner} />
                        </Box>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default KnockoutStage; 