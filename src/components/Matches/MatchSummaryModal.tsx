import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Divider,
    Paper
} from '@mui/material';
import { format } from 'date-fns';
import type { Match } from '../../types';

interface MatchSummaryModalProps {
    match: Match;
    open: boolean;
    onClose: () => void;
    onUpdateScores?: () => void;
}

export const MatchSummaryModal = ({ match, open, onClose, onUpdateScores }: MatchSummaryModalProps) => {
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
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    maxWidth: '550px !important'
                }
            }}
        >
            <DialogTitle sx={{ 
                bgcolor: '#001838',
                color: 'white',
                py: 2
            }}>
                Match Summary
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
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
            </DialogContent>
            <DialogActions sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                {onUpdateScores && (
                    <Button 
                        onClick={onUpdateScores}
                        variant="contained"
                        sx={{
                            bgcolor: '#FF6B00',
                            color: 'white',
                            mr: 1,
                            '&:hover': {
                                bgcolor: '#cc5500'
                            }
                        }}
                    >
                        Update Scores
                    </Button>
                )}
                <Button 
                    onClick={onClose}
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
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
}; 