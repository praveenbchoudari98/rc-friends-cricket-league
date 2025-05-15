import {
    Button,
    Typography,
    Box,
    Container,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stack
} from '@mui/material';
import { format } from 'date-fns';
import type { Match, Score, Team } from '../../types';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

interface MatchSummaryPageProps {
    match: Match;
    onUpdateScores?: (updatedMatch: Match) => void;
}

export const MatchSummaryPage = ({ match, onUpdateScores }: MatchSummaryPageProps) => {
    const navigate = useNavigate();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [scores, setScores] = useState({
        team1: {
            runs: match.result?.team1Score?.runs ?? '',
            wickets: match.result?.team1Score?.wickets ?? '',
            overs: match.result?.team1Score?.overs ?? ''
        },
        team2: {
            runs: match.result?.team2Score?.runs ?? '',
            wickets: match.result?.team2Score?.wickets ?? '',
            overs: match.result?.team2Score?.overs ?? ''
        }
    });

    if (!match.result || !match.inningsInfo) return null;

    const validateOvers = (value: string) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return '';
        if (numValue < 0) return 0;
        
        const maxOvers = match.matchType === 'super_duper_over' ? 2 : 20;
        if (numValue > maxOvers) {
            return maxOvers;
        }
        
        const integerPart = Math.floor(numValue);
        const decimalPart = numValue % 1;
        if (decimalPart >= 0.6) {
            return integerPart + 0.5;
        }
        return numValue;
    };

    const validateWickets = (value: string) => {
        const numValue = parseInt(value);
        if (isNaN(numValue)) return '';
        return Math.min(Math.max(numValue, 0), 10);
    };

    const validateRuns = (value: string) => {
        if (!/^\d*$/.test(value)) return '';
        const numValue = parseInt(value);
        if (isNaN(numValue)) return '';
        return Math.max(numValue, 0);
    };

    const renderScoreInputs = (team: 'team1' | 'team2', teamName: string) => (
        <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
                {teamName}
            </Typography>
            <Stack direction="row" spacing={2}>
                <TextField
                    label="Runs"
                    type="number"
                    value={scores[team].runs}
                    onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        const validatedValue = value ? validateRuns(value) : '';
                        setScores(prev => ({
                            ...prev,
                            [team]: { ...prev[team], runs: validatedValue }
                        }));
                    }}
                    fullWidth
                    placeholder="Enter runs"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ 
                        min: 0,
                        inputMode: 'numeric',
                        pattern: '[0-9]*'
                    }}
                    error={typeof scores[team].runs === 'number' && scores[team].runs < 0}
                    helperText={typeof scores[team].runs === 'number' && scores[team].runs < 0 ? 'Runs must be positive' : ''}
                />
                <TextField
                    label="Wickets"
                    type="number"
                    value={scores[team].wickets}
                    onChange={(e) => {
                        const value = e.target.value ? validateWickets(e.target.value) : '';
                        setScores(prev => ({
                            ...prev,
                            [team]: { ...prev[team], wickets: value }
                        }));
                    }}
                    fullWidth
                    placeholder="Enter wickets"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ min: 0, max: 10 }}
                    error={typeof scores[team].wickets === 'number' && (scores[team].wickets < 0 || scores[team].wickets > 10)}
                    helperText={
                        typeof scores[team].wickets === 'number' && scores[team].wickets < 0 
                            ? 'Wickets must be positive'
                            : typeof scores[team].wickets === 'number' && scores[team].wickets > 10 
                            ? 'Maximum 10 wickets allowed'
                            : ''
                    }
                />
                <TextField
                    label="Overs"
                    type="number"
                    value={scores[team].overs}
                    onChange={(e) => {
                        const value = e.target.value ? validateOvers(e.target.value) : '';
                        setScores(prev => ({
                            ...prev,
                            [team]: { ...prev[team], overs: value }
                        }));
                    }}
                    fullWidth
                    placeholder="Enter overs"
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ 
                        min: 0, 
                        max: match.matchType === 'super_duper_over' ? 2 : 20, 
                        step: 0.1
                    }}
                    error={typeof scores[team].overs === 'number' && (
                        scores[team].overs < 0 || 
                        scores[team].overs > (match.matchType === 'super_duper_over' ? 2 : 20)
                    )}
                    helperText={
                        typeof scores[team].overs === 'number' && scores[team].overs < 0 
                            ? 'Overs must be positive'
                            : typeof scores[team].overs === 'number' && 
                              scores[team].overs > (match.matchType === 'super_duper_over' ? 2 : 20)
                            ? `Maximum ${match.matchType === 'super_duper_over' ? 2 : 20} overs allowed`
                            : ''
                    }
                />
            </Stack>
        </Box>
    );

    const handleSubmit = () => {
        try {
            const team1Score: Score = {
                runs: typeof scores.team1.runs === 'number' ? scores.team1.runs : 0,
                wickets: typeof scores.team1.wickets === 'number' ? scores.team1.wickets : 0,
                overs: typeof scores.team1.overs === 'number' ? scores.team1.overs : 0
            };

            const team2Score: Score = {
                runs: typeof scores.team2.runs === 'number' ? scores.team2.runs : 0,
                wickets: typeof scores.team2.wickets === 'number' ? scores.team2.wickets : 0,
                overs: typeof scores.team2.overs === 'number' ? scores.team2.overs : 0
            };

            let result: 'win' | 'tie' = 'win';
            let winner: Team | null = null;

            if (team1Score.runs === team2Score.runs) {
                result = 'tie';
                winner = null;
            } else {
                winner = team1Score.runs > team2Score.runs ? match.team1 : match.team2;
            }

            const updatedMatch: Match = {
                ...match,
                status: 'completed',
                result: {
                    team1Score,
                    team2Score,
                    result,
                    winner: winner || match.team1 // Fallback to team1 to satisfy type requirement
                }
            };

            if (onUpdateScores) {
                onUpdateScores(updatedMatch);
            }
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error updating match:', error);
            alert('An error occurred while updating the match. Please try again.');
        }
    };

    const { team1, team2 } = match;
    const { team1Score, team2Score } = match.result;
    const { date, time } = match.inningsInfo;

    const getVictoryMargin = () => {
        if (!match.result || !match.inningsInfo) {
            return '';
        }
        
        if (!match.result.winner) {
            return 'Match Tied';
        }

        const battingFirstTeam = match.inningsInfo.battingFirst;
        const battingFirstScore = battingFirstTeam.id === match.team1.id ? match.result.team1Score : match.result.team2Score;
        const battingSecondScore = battingFirstTeam.id === match.team1.id ? match.result.team2Score : match.result.team1Score;
        
        // If batting first team won, they won by runs
        if (match.result.winner.id === battingFirstTeam.id) {
            return `${battingFirstScore.runs - battingSecondScore.runs} runs`;
        } else {
            // If chasing team won, they won by wickets
            return `${10 - battingSecondScore.wickets} wickets`;
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
                        onClick={() => setIsDialogOpen(true)}
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

            {/* Score Update Dialog */}
            <Dialog 
                open={isDialogOpen} 
                onClose={() => setIsDialogOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Update Match Score</DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {renderScoreInputs('team1', match.team1.name)}
                    {renderScoreInputs('team2', match.team2.name)}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

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