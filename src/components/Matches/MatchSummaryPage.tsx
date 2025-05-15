import {
    Button,
    Typography,
    Box,
    Divider,
    Paper,
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
    const { tossWinner, tossDecision, battingFirst, date, time } = match.inningsInfo;

    const getVictoryMargin = () => {
        if (!match.result) {
            return '';
        }
        
        if (!match.result.winner) {
            return 'Match Tied';
        }
        
        const battingFirstTeam = battingFirst;
        const battingFirstScore = battingFirstTeam.id === team1.id ? team1Score : team2Score;
        const battingSecondScore = battingFirstTeam.id === team1.id ? team2Score : team1Score;
        
        if (match.result.winner.id === battingFirstTeam.id) {
            return `won by ${battingFirstScore.runs - battingSecondScore.runs} runs`;
        } else {
            return `won by ${10 - battingSecondScore.wickets} wickets`;
        }
    };

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f5f5f5' }}>
            {/* Header */}
            <Box sx={{ 
                bgcolor: '#001838',
                color: 'white',
                py: 2,
                px: 3,
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
                <Typography variant="h6">
                    Match Summary
                </Typography>
            </Box>

            {/* Content */}
            <Container maxWidth="sm" sx={{ py: 4 }}>
                <Paper sx={{ 
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <Box sx={{ p: 3 }}>
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                {team1.name} vs {team2.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                {format(new Date(date), 'PPP')} at {time}
                            </Typography>
                            <Typography variant="body1" color="primary" sx={{ fontWeight: 600, mt: 1 }}>
                                {match.result.winner ? `${match.result.winner.name} ${getVictoryMargin()}` : getVictoryMargin()}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                Match Details
                            </Typography>
                            <Typography variant="body2" gutterBottom>
                                Toss: {tossWinner.name} won the toss and chose to {tossDecision} first
                            </Typography>
                            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                <Paper sx={{ 
                                    flex: 1, 
                                    p: 2,
                                    bgcolor: '#f8f9fa',
                                    border: '1px solid #e0e0e0'
                                }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        {team1.name}
                                    </Typography>
                                    <Typography variant="h6">
                                        {team1Score.runs}/{team1Score.wickets}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {team1Score.overs} overs
                                    </Typography>
                                </Paper>
                                <Paper sx={{ 
                                    flex: 1, 
                                    p: 2,
                                    bgcolor: '#f8f9fa',
                                    border: '1px solid #e0e0e0'
                                }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        {team2.name}
                                    </Typography>
                                    <Typography variant="h6">
                                        {team2Score.runs}/{team2Score.wickets}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {team2Score.overs} overs
                                    </Typography>
                                </Paper>
                            </Box>
                        </Box>

                        {/* Actions */}
                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'flex-end',
                            gap: 2,
                            mt: 3
                        }}>
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
                                    Update Scores
                                </Button>
                            )}
                            <Button 
                                onClick={() => navigate(-1)}
                                variant="outlined"
                                sx={{
                                    borderColor: '#FF8C00',
                                    color: '#001838',
                                    '&:hover': {
                                        borderColor: '#FF8C00',
                                        bgcolor: 'rgba(0,24,56,0.04)'
                                    }
                                }}
                            >
                                Back
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}; 