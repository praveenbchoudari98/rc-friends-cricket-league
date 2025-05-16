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
    const [matches, setMatches] = useState<string>('1');
    const [error, setError] = useState<string>('');

    const handleMatchesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        const numValue = parseInt(value);

        if (value === '') {
            setMatches('');
            setError('Please enter a value');
            return;
        }

        if (!/^\d+$/.test(value)) {
            return;
        }

        if (numValue < 1 || numValue > 5) {
            setMatches(value);
            setError('Value must be between 1 and 5');
        } else {
            setMatches(value);
            setError('');
        }
    };

    const handleBlur = () => {
        const numValue = parseInt(matches);
        if (matches === '' || isNaN(numValue) || numValue < 1) {
            setMatches('1');
            setError('');
        } else if (numValue > 5) {
            setMatches('5');
            setError('');
        }
    };

    const handleStart = () => {
        const numValue = parseInt(matches);
        if (numValue >= 1 && numValue <= 5) {
            onStart({ matchesPerTeamPair: numValue });
            onClose();
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
                        onChange={handleMatchesChange}
                        onBlur={handleBlur}
                        error={!!error}
                        helperText={error || "Each team will play this many times against every other team (1-5 matches)"}
                        InputProps={{
                            inputProps: {
                                min: 1,
                                max: 5,
                                step: 1
                            }
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&.Mui-focused fieldset': {
                                    borderColor: error ? 'error.main' : '#FF6B00'
                                }
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: error ? 'error.main' : '#FF6B00'
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
                    disabled={!!error || matches === ''}
                    sx={{
                        bgcolor: '#FF6B00',
                        color: 'white',
                        '&:hover': {
                            bgcolor: '#cc5500'
                        },
                        '&.Mui-disabled': {
                            bgcolor: 'rgba(255,107,0,0.5)'
                        }
                    }}
                >
                    Start Tournament
                </Button>
            </DialogActions>
        </Dialog>
    );
}