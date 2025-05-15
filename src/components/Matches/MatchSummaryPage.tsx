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
                position: 'sticky',
                top: 0,
                zIndex: 1000
            }}>
                <Container maxWidth="sm">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton 
                            color="inherit" 
                            onClick={() => navigate(-1)}
                            sx={{ p: 1 }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h6">
                            Match Summary
                        </Typography>
                    </Box>
                </Container>
            </Box>

            {/* Content */}
            <Container 
                maxWidth="sm" 
                sx={{ 
                    mt: 3,
                    mb: 4,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 1,
                    overflow: 'hidden'
                }}
            >
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
                            <Paper sx={{ flex: 1, p: 2 }}>
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
                            <Paper sx={{ flex: 1, p: 2 }}>
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

                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'flex-end',
                        gap: 2,
                        mt: 4
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
                    </Box>
                </Box>
            </Container>
        </Box>
    );
}; 