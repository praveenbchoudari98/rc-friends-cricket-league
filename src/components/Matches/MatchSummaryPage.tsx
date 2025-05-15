import {
    Button,
    Typography,
    Box,
    Container,
    IconButton
} from '@mui/material';
import { format } from 'date-fns';
import type { Match } from '../../types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

interface MatchSummaryPageProps {
    match: Match;
    onUpdateScores?: () => void;
}

export const MatchSummaryPage = ({ match, onUpdateScores }: MatchSummaryPageProps) => {
    const navigate = useNavigate();
    if (!match.result || !match.inningsInfo) return null;

    const { team1, team2 } = match;
    const { team1Score, team2Score } = match.result;
    const { date, time } = match.inningsInfo;

    const getVictoryMargin = () => {
        if (!match.result) {
            return '';
        }
        
        if (!match.result.winner) {
            return 'Match Tied';
        }
        
        if (match.result.winner.id === team1.id) {
            return match.result.team1Score.runs > match.result.team2Score.runs
                ? `${match.result.team1Score.runs - match.result.team2Score.runs} runs`
                : `${10 - match.result.team1Score.wickets} wickets`;
        } else {
            return match.result.team2Score.runs > match.result.team1Score.runs
                ? `${match.result.team2Score.runs - match.result.team1Score.runs} runs`
                : `${10 - match.result.team2Score.wickets} wickets`;
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#1a2d7d' }}>
            {/* Navigation Bar */}
            <Box sx={{ 
                bgcolor: '#1a2d7d',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                py: 1.5,
                px: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                justifyContent: 'space-between'
            }}>
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 2
                }}>
                    <IconButton 
                        onClick={() => navigate(-1)}
                        sx={{ color: 'white' }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography variant="body1" sx={{ color: 'white', fontWeight: 500 }}>
                        MATCHES
                    </Typography>
                </Box>
                
                {onUpdateScores && (
                    <Button 
                        onClick={onUpdateScores}
                        variant="contained"
                        sx={{
                            bgcolor: '#FF6B00',
                            color: 'white',
                            '&:hover': {
                                bgcolor: '#cc5500'
                            }
                        }}
                    >
                        Update Score
                    </Button>
                )}
            </Box>

            {/* Teams and Scores Section */}
            <Container maxWidth="lg" sx={{ pt: 4, pb: 3 }}>
                <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4
                }}>
                    {/* Team 1 */}
                    <Box sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        <Box
                            component="img"
                            src={team1.logo}
                            alt={team1.name}
                            sx={{
                                width: 100,
                                height: 100,
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                            }}
                        />
                        <Typography variant="h3" sx={{ 
                            color: 'white',
                            fontSize: '2.5rem',
                            fontWeight: 700
                        }}>
                            {team1Score.runs}/{team1Score.wickets}
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {team1Score.overs} Overs
                        </Typography>
                    </Box>

                    {/* Match Info */}
                    <Box sx={{ 
                        textAlign: 'center',
                        color: 'rgba(255,255,255,0.7)'
                    }}>
                        <Box sx={{ 
                            bgcolor: 'white',
                            color: '#1a2d7d',
                            px: 2,
                            py: 0.5,
                            borderRadius: 1,
                            mb: 2,
                            display: 'inline-block'
                        }}>
                            MATCH {match.matchNumber}
                        </Box>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                            {match.venue || 'Wankhede Stadium, Mumbai'}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 0.5 }}>
                            {format(new Date(date), 'dd MMM yyyy')}
                        </Typography>
                        <Typography variant="body2">
                            {format(new Date(`2000-01-01 ${time}`), 'h:mm a')} IST
                        </Typography>
                    </Box>

                    {/* Team 2 */}
                    <Box sx={{ 
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2
                    }}>
                        <Box
                            component="img"
                            src={team2.logo}
                            alt={team2.name}
                            sx={{
                                width: 100,
                                height: 100,
                                objectFit: 'contain',
                                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                            }}
                        />
                        <Typography variant="h3" sx={{ 
                            color: 'white',
                            fontSize: '2.5rem',
                            fontWeight: 700
                        }}>
                            {team2Score.runs}/{team2Score.wickets}
                        </Typography>
                        <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                            {team2Score.overs} Overs
                        </Typography>
                    </Box>
                </Box>

                {/* Result Banner */}
                <Box sx={{ 
                    bgcolor: '#1e367c',
                    py: 2,
                    textAlign: 'center'
                }}>
                    <Typography variant="h6" sx={{ 
                        color: 'white',
                        fontWeight: 500
                    }}>
                        {match.result.result === 'tie' 
                            ? 'Match Tied'
                            : `${match.result.winner?.name} Won by ${getVictoryMargin()}`
                        }
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
}; 