import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    Typography,
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
    Tooltip,
    Stack,
    Divider
} from '@mui/material';
import type { Match, Team, TossDecision, Score, MatchOutcome, TournamentStage } from '../../types';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { ScoreboardUploader } from '../ScoreboardUploader';
import { format } from 'date-fns';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

interface MatchCardProps {
    match: Match;
    onUpdate?: (updatedMatch: Match) => void;
    currentStage?: TournamentStage;
    readOnly?: boolean;
    shouldOpenUpdateDialog?: boolean;
}

interface TeamScoreProps {
    team: Team;
    score?: Score;
    isCompleted?: boolean;
}

const TeamScore = ({ team, score, isCompleted }: TeamScoreProps) => (
    <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        gap: 2,
        width: '100%'
    }}>
        <Box
            component="img"
            src={team.logo}
            alt={team.name}
            sx={{ 
                width: 36,
                height: 36,
                objectFit: 'contain'
            }}
        />
        <Box sx={{ flex: 1 }}>
            <Typography 
                variant="subtitle1" 
                sx={{ 
                    fontWeight: 500,
                    color: '#1A1A1A',
                    fontSize: '0.875rem',
                    lineHeight: 1.2
                }}
            >
                {team.name}
            </Typography>
            {isCompleted && score && (
                <Typography 
                    variant="body1" 
                    sx={{ 
                        fontWeight: 600,
                        color: '#1A1A1A',
                        fontSize: '0.875rem',
                        lineHeight: 1.5,
                        mt: '2px'
                    }}
                >
                    {score.runs}/{score.wickets}
                    <Typography 
                        component="span" 
                        sx={{ 
                            ml: 0.5,
                            color: '#666666',
                            fontSize: '0.85rem'
                        }}
                    >
                        ({score.overs} OV)
                    </Typography>
                </Typography>
            )}
        </Box>
    </Box>
);

export const MatchCard = ({ 
    match, 
    onUpdate = () => {
        console.warn('No onUpdate handler provided to MatchCard component');
    }, 
    currentStage,
    readOnly = false,
    shouldOpenUpdateDialog = false
}: MatchCardProps) => {
    const navigate = useNavigate();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isScreenshotDialogOpen, setIsScreenshotDialogOpen] = useState(false);
    const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false);
    const [tossWinner, setTossWinner] = useState<Team | null>(match.inningsInfo?.tossWinner || null);
    const [tossDecision, setTossDecision] = useState<TossDecision | ''>('');
    const [matchDate, setMatchDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
    const [matchTime, setMatchTime] = useState<string>(format(new Date(), 'HH:mm'));
    const [venue, setVenue] = useState<string>('Wankhede Stadium, Mumbai');
    const [currentStep, setCurrentStep] = useState(1);
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

    useEffect(() => {
        if (shouldOpenUpdateDialog) {
            setIsDialogOpen(true);
            // Clear the update match ID from session storage
            sessionStorage.removeItem('updateMatchId');
        }
    }, [shouldOpenUpdateDialog]);

    const isCompleted = match.status === 'completed';

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setCurrentStep(1); // Reset step when closing
    };

    const handleNext = () => {
        if (currentStep === 1 && (!tossWinner || !tossDecision)) {
            alert('Please select toss winner and decision');
            return;
            }
        setCurrentStep(prev => Math.min(prev + 1, 3));
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = () => {
        try {
        if (!tossWinner || !tossDecision) {
            alert('Please select toss winner and decision');
            return;
        }

        // Validate that all score fields are filled
        const team1Scores = scores.team1;
        const team2Scores = scores.team2;
        if (
            team1Scores.runs === '' || team1Scores.wickets === '' || team1Scores.overs === '' ||
            team2Scores.runs === '' || team2Scores.wickets === '' || team2Scores.overs === ''
        ) {
            alert('Please fill in all score fields');
            return;
        }

        const battingFirst = tossDecision === 'bat' ? tossWinner : 
            (tossWinner.id === match.team1.id ? match.team2 : match.team1);

        const team1Score: Score = {
            runs: Number(scores.team1.runs),
            wickets: Number(scores.team1.wickets),
            overs: Number(scores.team1.overs)
        };
        const team2Score: Score = {
            runs: Number(scores.team2.runs),
            wickets: Number(scores.team2.wickets),
            overs: Number(scores.team2.overs)
        };
        
        let result: MatchOutcome;
        let winner: Team | undefined;
        
        // Check for tie
        if (team1Score.runs === team2Score.runs) {
            console.log('Match is tied:', team1Score.runs, team2Score.runs);
            result = 'tie';
            winner = undefined;
        } else {
            console.log('Match has a winner:', team1Score.runs, team2Score.runs);
            result = 'win';
            winner = team1Score.runs > team2Score.runs ? match.team1 : match.team2;
        }

        const updatedMatch: Match = {
            ...match,
                venue: 'Wankhede Stadium, Mumbai',
                status: 'completed',
            inningsInfo: {
                tossWinner,
                tossDecision,
                battingFirst,
                    date: new Date(),
                    time: new Date().toLocaleTimeString()
            },
            result: {
                winner,
                team1Score,
                team2Score,
                result
            }
        };

        onUpdate(updatedMatch);
        handleCloseDialog();
        } catch (error) {
            console.error('Error updating match:', error);
            alert('An error occurred while updating the match. Please try again.');
        }
    };

    const validateOvers = (value: string) => {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) return '';
        if (numValue < 0) return 0;
        
        // For super duper overs, limit to 2 overs
        const maxOvers = match.matchType === 'super_duper_over' ? 2 : 20;
        if (numValue > maxOvers) {
            // Show error message for super duper over
            if (match.matchType === 'super_duper_over') {
                alert('Maximum 2 overs allowed in Super Duper Over');
            }
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
        // Only allow numeric values
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
                        // Only allow numeric input
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        const validatedValue = value ? validateRuns(value) : '';
                        setScores(prev => ({
                            ...prev,
                            [team]: { ...prev[team], runs: validatedValue }
                        }));
                    }}
                    onKeyDown={(e) => {
                        // Prevent non-numeric input including 'e', '+', '-'
                        if (![
                            '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                            'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'
                        ].includes(e.key)) {
                            e.preventDefault();
                        }
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
                        step: 0.1,
                        'data-testid': 'overs-input'
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

    const handleOpenDialog = () => {
        setMatchDate(format(new Date(), 'yyyy-MM-dd'));
        setMatchTime(format(new Date(), 'HH:mm'));
        setVenue('Wankhede Stadium, Mumbai');
        setIsDialogOpen(true);
    };

    const handleScreenshotDialogOpen = () => {
        setIsScreenshotDialogOpen(true);
    };

    const handleScreenshotDialogClose = () => {
        setIsScreenshotDialogOpen(false);
    };

    const handleScreenshotSubmit = (matchData: Partial<Match>) => {
        try {
            if (!matchData.result) {
                throw new Error('No result data found in the screenshot');
            }

            // Determine the result type and winner
            const team1Score = matchData.result.team1Score;
            const team2Score = matchData.result.team2Score;
            
            if (!team1Score || !team2Score) {
                throw new Error('Missing score data for one or both teams');
            }

            let result: MatchOutcome;
            let winner: Team | undefined;
            
            // Check for tie
            if (team1Score.runs === team2Score.runs) {
                result = 'tie';
                winner = undefined;
            } else {
                result = 'win';
                winner = team1Score.runs > team2Score.runs ? match.team1 : match.team2;
            }

            const updatedMatch: Match = {
                ...match,
                status: 'completed',
                result: {
                    team1Score,
                    team2Score,
                    result,
                    winner
                },
                inningsInfo: {
                    battingFirst: matchData.team1!,
                    date: new Date(),
                    time: new Date().toLocaleTimeString(),
                    tossWinner: matchData.team1!,
                    tossDecision: 'bat'
                }
            };

            console.log('Updating match with screenshot data:', updatedMatch);
            onUpdate(updatedMatch);
            handleScreenshotDialogClose();
        } catch (error) {
            console.error('Error updating match:', error);
            alert('Failed to update match with screenshot data. Please try again.');
        }
    };

    const handleSummaryOpen = () => {
        setIsSummaryDialogOpen(true);
    };

    const handleSummaryClose = () => {
        setIsSummaryDialogOpen(false);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Box>
                        <Typography variant="subtitle1" gutterBottom>
                            Match Details
                        </Typography>
                        <Stack spacing={3}>
                            <Stack spacing={2}>
                                <TextField
                                    label="Date"
                                    type="date"
                                    value={matchDate}
                                    onChange={(e) => setMatchDate(e.target.value)}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    label="Time"
                                    type="time"
                                    value={matchTime}
                                    onChange={(e) => setMatchTime(e.target.value)}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                />
                                <TextField
                                    label="Venue"
                                    value={venue}
                                    onChange={(e) => setVenue(e.target.value)}
                                    fullWidth
                                />
                            </Stack>

                            <Divider />

                            <Typography variant="subtitle1" gutterBottom>
                                Toss Details
                            </Typography>
                            <Stack spacing={2}>
                                <FormControl fullWidth>
                                    <InputLabel>Toss Winner</InputLabel>
                                    <Select
                                        value={tossWinner?.id || ''}
                                        onChange={(e) => setTossWinner(
                                            e.target.value === match.team1.id ? match.team1 : match.team2
                                        )}
                                        label="Toss Winner"
                                        data-testid="toss-winner-select"
                                    >
                                        <MenuItem 
                                            value={match.team1.id} 
                                            role="option"
                                            data-testid="toss-winner-team1-option"
                                        >
                                            {match.team1.name}
                                        </MenuItem>
                                        <MenuItem 
                                            value={match.team2.id} 
                                            role="option"
                                            data-testid="toss-winner-team2-option"
                                        >
                                            {match.team2.name}
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel>Toss Decision</InputLabel>
                                    <Select
                                        value={tossDecision}
                                        onChange={(e) => setTossDecision(e.target.value as TossDecision)}
                                        label="Toss Decision"
                                        data-testid="toss-decision-select"
                                    >
                                        <MenuItem 
                                            value="bat" 
                                            role="option"
                                            data-testid="toss-decision-bat-option"
                                        >
                                            Bat
                                        </MenuItem>
                                        <MenuItem 
                                            value="bowl" 
                                            role="option"
                                            data-testid="toss-decision-bowl-option"
                                        >
                                            Bowl
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Stack>
                        </Stack>
                    </Box>
                );
            case 2:
                const battingFirstTeam = tossDecision === 'bat' ? tossWinner :
                    (tossWinner?.id === match.team1.id ? match.team2 : match.team1);
                return renderScoreInputs(
                    battingFirstTeam?.id === match.team1.id ? 'team1' : 'team2',
                    battingFirstTeam?.name || ''
                );
            case 3:
                const battingSecondTeam = tossDecision === 'bowl' ? tossWinner :
                    (tossWinner?.id === match.team1.id ? match.team2 : match.team1);
                return renderScoreInputs(
                    battingSecondTeam?.id === match.team1.id ? 'team1' : 'team2',
                    battingSecondTeam?.name || ''
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Card 
                sx={{ 
                    mb: 2,
                    borderRadius: 0,
                    overflow: 'hidden',
                    boxShadow: 'none',
                    border: '1px solid #E5E5E5',
                    '&:hover': {
                        boxShadow: '0 2px 5px rgba(0,0,0,0.08)'
                    }
                }}
            >
                {/* Match Info Header */}
                        <Box sx={{
                                    display: 'flex', 
                                    alignItems: 'center',
                            gap: 2,
                    p: '12px 16px',
                    borderBottom: '1px solid #E5E5E5',
                    bgcolor: '#FFFFFF'
                }}>
                    <Box sx={{ flex: 1 }}>
                                    <Typography variant="body2" sx={{ 
                            color: '#1A1A1A', 
                                        fontWeight: 500,
                            fontSize: '0.875rem',
                            lineHeight: 1.2
                        }}>
                            {venue}
                            </Typography>
                    </Box>
                    {!readOnly && (
                        <Tooltip title="Upload Scoreboard Screenshot">
                            <IconButton
                                size="small"
                                onClick={handleScreenshotDialogOpen}
                    sx={{ 
                                    color: '#666666',
                                    padding: '6px',
                                    '&:hover': {
                                        backgroundColor: 'rgba(0,0,0,0.04)' 
                                    }
                    }}
                >
                                <AddPhotoAlternateIcon sx={{ fontSize: '1.25rem' }} />
                            </IconButton>
                        </Tooltip>
                    )}
                    </Box>

                <CardContent sx={{ 
                    p: '16px',
                    '&:last-child': { pb: '16px' }
                }}>
                    {/* Match Result (if completed) */}
                    {isCompleted && match.result?.winner && (
                            <Typography 
                            variant="body2" 
                                sx={{ 
                                mb: 2,
                                fontWeight: 600,
                                color: '#1A1A1A',
                                fontSize: '0.875rem',
                                lineHeight: 1.2
                            }}
                        >
                            {match.result.winner.name} WON BY {
                                match.result.winner.id === match.team1.id 
                                    ? match.result.team1Score.runs > match.result.team2Score.runs
                                        ? `${match.result.team1Score.runs - match.result.team2Score.runs} RUNS`
                                        : `${10 - match.result.team1Score.wickets} WICKETS`
                                    : match.result.team2Score.runs > match.result.team1Score.runs
                                        ? `${match.result.team2Score.runs - match.result.team1Score.runs} RUNS`
                                        : `${10 - match.result.team2Score.wickets} WICKETS`
                            }
                            </Typography>
                    )}
                    {isCompleted && match.result?.result === 'tie' && (
                            <Typography 
                                variant="body2" 
                        sx={{
                                mb: 2,
                            fontWeight: 600,
                                color: '#1A1A1A'
                                }}
                            >
                            MATCH TIED
                        </Typography>
                        )}

                    {/* Teams */}
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 2.5
                    }}>
                        <TeamScore 
                            team={match.team1} 
                            score={match.result?.team1Score}
                            isCompleted={isCompleted}
                        />
                        <TeamScore 
                            team={match.team2} 
                            score={match.result?.team2Score}
                            isCompleted={isCompleted}
                        />
                    </Box>

                    {/* Action Buttons */}
                        <Box sx={{
                        mt: 2,
                                    display: 'flex', 
                        justifyContent: 'center',
                        gap: 2
                    }}>
                        {isCompleted ? (
                            <Button
                                variant="outlined"
                        size="small"
                                onClick={() => navigate(`/match/${match.id}`)}
                        sx={{
                                    color: '#FF1640',
                                    borderColor: '#FF1640',
                                    textTransform: 'none',
                                    fontSize: '0.875rem',
                                    fontWeight: 600,
                                    padding: '8px 24px',
                                    minWidth: '140px',
                                    borderRadius: '4px',
                                    borderWidth: '1.5px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        borderColor: '#FF1640',
                                        backgroundColor: 'rgba(255, 22, 64, 0.04)',
                                        transform: 'translateY(-1px)',
                                        boxShadow: '0 4px 8px rgba(255, 22, 64, 0.15)',
                                    },
                                    '&:active': {
                                        transform: 'translateY(0)',
                                        boxShadow: '0 2px 4px rgba(255, 22, 64, 0.1)',
                                    },
                                    '&::before': {
                                        content: '""',
                            position: 'absolute',
                                        top: 0,
                                        left: '-100%',
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(90deg, transparent, rgba(255, 22, 64, 0.1), transparent)',
                                        transition: 'all 0.6s ease',
                                    },
                                    '&:hover::before': {
                                        left: '100%',
                                    }
                                }}
                            >
                                View Summary
                            </Button>
                        ) : !readOnly && (
                            <Button
                                variant="contained"
                                size="small"
                                onClick={handleOpenDialog}
                                sx={{
                                    bgcolor: '#FF1640',
                            color: 'white',
                                    textTransform: 'none',
                                    fontSize: '0.875rem',
                                        fontWeight: 500,
                                    padding: '6px 16px',
                                    minWidth: '100px',
                                    borderRadius: '4px',
                                    '&:hover': {
                                        bgcolor: '#E31236'
                                    }
                                }}
                            >
                                Add Score
                            </Button>
                        )}
                            </Box>
                </CardContent>
            </Card>

            {/* Score Dialog */}
            <Dialog 
                open={isDialogOpen} 
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
                keepMounted={false}
                disablePortal
                aria-labelledby="score-dialog-title"
                sx={{ 
                    '& .MuiDialog-root': { inset: 0 },
                    '& .MuiDialog-paper': { 
                        zIndex: (theme) => theme.zIndex.modal + 1 
                    }
                }}
            >
                <DialogTitle id="score-dialog-title">Add Match Score</DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    {renderStepContent()}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    {currentStep > 1 && (
                        <Button onClick={handleBack}>
                            Back
                        </Button>
                    )}
                    {currentStep < 3 ? (
                        <Button onClick={handleNext} variant="contained" color="primary">
                            Next
                        </Button>
                    ) : (
                        <Button onClick={handleSubmit} variant="contained" color="primary">
                            Save
                    </Button>
                    )}
                </DialogActions>
            </Dialog>

            {/* Screenshot Upload Dialog */}
            <Dialog 
                open={isScreenshotDialogOpen} 
                onClose={handleScreenshotDialogClose}
                maxWidth="md"
                fullWidth
                keepMounted={false}
                disablePortal
                aria-labelledby="screenshot-dialog-title"
                sx={{ '& .MuiDialog-root': { inset: 0 } }}
            >
                <DialogTitle id="screenshot-dialog-title">Upload Scoreboard Screenshot</DialogTitle>
                <DialogContent>
                    <ScoreboardUploader
                        teams={[match.team1, match.team2]}
                        onScoreSubmit={handleScreenshotSubmit}
                    />
                </DialogContent>
            </Dialog>

            {/* Summary Dialog */}
            <Dialog
                open={isSummaryDialogOpen}
                onClose={handleSummaryClose}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '0',
                        background: '#1a2d7d',
                        maxWidth: '100%',
                        margin: 0,
                        width: '100%',
                        height: '100%'
                    }
                }}
            >
                <DialogContent sx={{ p: 0, height: '100%', position: 'relative' }}>
                    <Box sx={{ 
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        position: 'relative',
                        pt: 4
                    }}>
                        {/* Team Scores Section */}
                    <Box sx={{
                            width: '100%',
                        display: 'flex',
                            justifyContent: 'center',
                        alignItems: 'center',
                            gap: 8,
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
                                src={match.team1.logo}
                                alt={match.team1.name}
                                sx={{
                                        width: 120,
                                        height: 120,
                                        objectFit: 'contain'
                                }}
                            />
                                {match.result?.team1Score && (
                                    <Box sx={{ textAlign: 'center' }}>
                                        <Typography 
                                            variant="h3"
                                            sx={{
                                                color: 'white',
                                                fontSize: '3.5rem',
                                                fontWeight: 700,
                                                lineHeight: 1
                                            }}
                                        >
                                        {match.result.team1Score.runs}/{match.result.team1Score.wickets}
                                        </Typography>
                                        <Typography 
                                            sx={{
                                                color: '#ffffff99',
                                                fontSize: '1.25rem',
                                                mt: 1
                                            }}
                                        >
                                            {match.result.team1Score.overs} Overs
                            </Typography>
                                    </Box>
                        )}
                        </Box>

                            {/* Match Info */}
                        <Box sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2
                            }}>
                                <Box sx={{
                                    bgcolor: '#ffffff',
                                    color: '#1a2d7d',
                                    py: 0.75,
                            px: 2,
                                    borderRadius: '4px',
                                    fontWeight: 600,
                                    fontSize: '0.875rem'
                                }}>
                                    MATCH {match.matchNumber || 1}
                                </Box>
                                <Typography sx={{ 
                                    color: '#ffffff99',
                                    fontSize: '1rem',
                                    textAlign: 'center'
                                }}>
                                    {match.venue || 'Eden Gardens, Kolkata'}<br/>
                                    {format(new Date(match.date || new Date()), 'dd MMM yyyy')}<br/>
                                    {format(new Date(match.time || new Date()), 'h:mm a')} IST
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
                                src={match.team2.logo}
                                alt={match.team2.name}
                                sx={{
                                        width: 120,
                                        height: 120,
                                        objectFit: 'contain'
                                }}
                            />
                                {match.result?.team2Score && (
                                    <Box sx={{ textAlign: 'center' }}>
                        <Typography 
                                            variant="h3"
                            sx={{ 
                                                color: 'white',
                                                fontSize: '3.5rem',
                                                fontWeight: 700,
                                                lineHeight: 1
                            }}
                        >
                                            {match.result.team2Score.runs}/{match.result.team2Score.wickets}
                        </Typography>
                            <Typography 
                                sx={{ 
                                                color: '#ffffff99',
                                                fontSize: '1.25rem',
                                                mt: 1
                                }}
                            >
                                            {match.result.team2Score.overs} Overs
                            </Typography>
                                    </Box>
                        )}
                            </Box>
                    </Box>

                        {/* Result Section */}
                        <Box sx={{ 
                            width: '100%',
                            bgcolor: '#1e367c',
                            py: 2,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Typography 
                                sx={{
                                    color: 'white',
                                    fontSize: '1.5rem',
                                    fontWeight: 500
                                }}
                            >
                                {match.result?.result === 'tie' ? 'Match Tied' : 
                                    match.result?.winner && `${match.result.winner.name} Won by ${
                                        match.result.winner.id === match.team1.id 
                                            ? match.result.team1Score.runs > match.result.team2Score.runs
                                                ? `${match.result.team1Score.runs - match.result.team2Score.runs} runs`
                                                : `${10 - match.result.team1Score.wickets} wickets`
                                            : match.result.team2Score.runs > match.result.team1Score.runs
                                                ? `${match.result.team2Score.runs - match.result.team1Score.runs} runs`
                                                : `${10 - match.result.team2Score.wickets} wickets`
                                    }`
                                }
                            </Typography>
                    </Box>

                        {/* Update Score Button */}
                        {!readOnly && (
                            <Button
                                variant="contained"
                                onClick={() => {
                                    setIsDialogOpen(true);
                                    setIsSummaryDialogOpen(false);
                                }}
                            sx={{ 
                                    position: 'absolute',
                                    top: 16,
                                    right: 16,
                                    bgcolor: '#FF1640',
                    color: 'white',
                                '&:hover': {
                                        bgcolor: '#E31236'
                                }
                            }}
                        >
                                Update Score
                        </Button>
                    )}

                        {/* Close Button */}
                        <IconButton
                            onClick={handleSummaryClose}
                        sx={{
                                position: 'absolute',
                                top: 16,
                                left: 16,
                                color: 'white'
                        }}
                    >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}; 