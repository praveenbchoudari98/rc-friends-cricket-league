import { useState } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    TextField,
    Typography,
    Box
} from '@mui/material';

interface TournamentStartModalProps {
    open: boolean;
    onClose: () => void;
    onStart: (config: { matchesPerTeamPair: number }) => void;
}

export const TournamentStartModal = ({ open, onClose, onStart }: TournamentStartModalProps) => {
    const [matches, setMatches] = useState(1);

    const handleStart = () => {
        onStart({ matchesPerTeamPair: matches });
        onClose();
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
                    bgcolor: 'background.paper'
                }
            }}
        >
            <DialogTitle sx={{ 
                bgcolor: '#001838',
                color: 'white',
                py: 2
            }}>
                Tournament Configuration
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                <Typography variant="body1" gutterBottom>
                    Configure how many times each team should play against other teams in the league stage.
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Matches per team pair"
                        type="number"
                        value={matches}
                        onChange={(e) => setMatches(Math.max(1, Math.min(5, parseInt(e.target.value) || 1)))}
                        InputProps={{ 
                            inputProps: { min: 1, max: 5 }
                        }}
                        helperText="Each team will play this many times against every other team (1-5 matches)"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: '#FF6B00'
                                }
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: '#FF6B00'
                            }
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2, bgcolor: '#f8f9fa' }}>
                <Button 
                    onClick={onClose}
                    sx={{ 
                        color: '#001838',
                        '&:hover': {
                            bgcolor: 'rgba(0,24,56,0.04)'
                        }
                    }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleStart}
                    variant="contained"
                    sx={{
                        bgcolor: '#FF6B00',
                        color: 'white',
                        '&:hover': {
                            bgcolor: '#cc5500'
                        }
                    }}
                >
                    Start Tournament
                </Button>
            </DialogActions>
        </Dialog>
    );
}; 