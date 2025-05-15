import React, { useState, useRef } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Avatar,
    IconButton,
} from '@mui/material';
import type { Team } from '../../types';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { getTeamNameError } from '../../utils/validation';
import { createPortal } from 'react-dom';
import { PLAYER_AVATARS, getTeamAvatar } from '../Tournament/TeamCard';

interface TeamFormProps {
    onSubmit: (team: Team, sourceRect: DOMRect) => void;
    teams: Team[];
}

export const TeamForm = ({ onSubmit, teams }: TeamFormProps) => {
    const [teamName, setTeamName] = useState('');
    const [previewImage, setPreviewImage] = useState<string>(PLAYER_AVATARS[0]);
    const [nameError, setNameError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    // Update preview avatar when team name changes
    const updatePreviewAvatar = (name: string) => {
        if (!name) {
            setPreviewImage(PLAYER_AVATARS[0]);
            return;
        }
        // Create a temporary ID based on the name for preview
        const tempId = name.toLowerCase().replace(/[^a-z0-9]/g, '');
        setPreviewImage(getTeamAvatar(tempId));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const error = getTeamNameError(teams, teamName);
        if (error) {
            setNameError(error);
            return;
        }

        setIsSubmitting(true);
        
        // Get the form's position for animation
        const formRect = formRef.current?.getBoundingClientRect() || new DOMRect();
        
        // Create the new team with proper avatar
        const newTeam = {
            id: Date.now().toString(),
            name: teamName.trim(),
            logo: fileInputRef.current?.files?.[0] ? previewImage : getTeamAvatar(Date.now().toString())
        };

        // Delay to allow animation to complete
        await new Promise(resolve => setTimeout(resolve, 800));
        
        onSubmit(newTeam, formRect);
        
        setTeamName('');
        setPreviewImage(PLAYER_AVATARS[0]);
        setNameError('');
        setIsSubmitting(false);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setTeamName(newName);
        setNameError(getTeamNameError(teams, newName));
        updatePreviewAvatar(newName);
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Paper 
            elevation={0}
            sx={{ 
                p: 0,
                maxWidth: 500,
                mx: 'auto',
                mb: 4,
                borderRadius: '8px 8px 3px 3px',
                background: '#FFFFFF',
                position: 'relative',
                overflow: 'visible',
                boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -15,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '60px',
                    height: '30px',
                    background: '#FF8C00',
                    borderRadius: '5px 5px 0 0',
                    boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.1)',
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: -8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '20px',
                    height: '20px',
                    background: '#E67E00',
                    borderRadius: '50%',
                    border: '2px solid #FF8C00',
                }
            }}
        >
            <Box 
                sx={{ 
                    background: 'linear-gradient(135deg, #FF8C00 0%, #E67E00 100%)',
                    p: 2,
                    borderRadius: '8px 8px 0 0',
                    textAlign: 'center',
                    color: 'white',
                    position: 'relative',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
            >
                <Typography variant="h5" sx={{ 
                    fontWeight: 600,
                    letterSpacing: '0.02em',
                }}>
                    Team Registration
                </Typography>
            </Box>

            <Box 
                component="form" 
                ref={formRef}
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 3,
                    p: 4,
                    minHeight: '320px',
                    background: `
                        repeating-linear-gradient(
                            #FFFFFF,
                            #FFFFFF 39px,
                            #E5E5E5 39px,
                            #E5E5E5 40px
                        )
                    `,
                    backgroundPosition: '0 48px',
                    position: 'relative',
                    '&::after': isSubmitting ? {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))',
                        backdropFilter: 'blur(4px)',
                        animation: 'ghostlyFade 0.8s ease-out forwards',
                        '@keyframes ghostlyFade': {
                            '0%': {
                                opacity: 0,
                                transform: 'translateY(0)',
                                backdropFilter: 'blur(0px)'
                            },
                            '50%': {
                                opacity: 0.8,
                                transform: 'translateY(0)',
                                backdropFilter: 'blur(4px)'
                            },
                            '100%': {
                                opacity: 0,
                                transform: 'translateY(10px)',
                                backdropFilter: 'blur(8px)'
                            }
                        }
                    } : {}
                }}
            >
                <Box sx={{ 
                    display: 'flex',
                    justifyContent: 'center',
                    mb: 2,
                    position: 'relative'
                }}>
                    <Avatar
                        src={previewImage}
                        sx={{
                            width: 100,
                            height: 100,
                            border: '3px solid #FF8C00',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease-in-out',
                            boxShadow: '0 4px 20px rgba(255, 140, 0, 0.15)',
                            bgcolor: 'white',
                            '&:hover': {
                                transform: 'scale(1.05)',
                                boxShadow: '0 6px 25px rgba(255, 140, 0, 0.2)',
                            }
                        }}
                        onClick={() => fileInputRef.current?.click()}
                    />
                    <IconButton
                        color="primary"
                        aria-label="upload picture"
                        component="span"
                        onClick={() => fileInputRef.current?.click()}
                        sx={{
                            position: 'absolute',
                            bottom: -5,
                            right: '35%',
                            background: 'linear-gradient(135deg, #FF8C00 0%, #E67E00 100%)',
                            color: 'white',
                            boxShadow: '0 2px 10px rgba(255, 140, 0, 0.3)',
                            width: 35,
                            height: 35,
                            '&:hover': {
                                background: 'linear-gradient(135deg, #E67E00 0%, #CC7000 100%)',
                                transform: 'scale(1.1)',
                            },
                            transition: 'all 0.2s ease-in-out'
                        }}
                    >
                        <PhotoCamera sx={{ fontSize: 18 }} />
                    </IconButton>
                    <input
                        type="file"
                        hidden
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleImageUpload}
                    />
                </Box>

                <TextField
                    fullWidth
                    label="Team Name"
                    value={teamName}
                    onChange={handleNameChange}
                    error={!!nameError}
                    helperText={nameError || (teamName.length > 0 && teamName.length < 3 ? 'Name must be at least 3 characters' : ' ')}
                    variant="standard"
                    sx={{
                        '& .MuiInput-root': {
                            '&:before, &:after': {
                                borderBottom: '2px solid rgba(255, 140, 0, 0.3)',
                            },
                            '&:hover:not(.Mui-disabled):before': {
                                borderBottom: '2px solid rgba(255, 140, 0, 0.5)',
                            },
                            '&.Mui-focused:after': {
                                borderBottom: '2px solid #FF8C00',
                            }
                        },
                        '& .MuiInputLabel-root': {
                            color: '#666666',
                            '&.Mui-focused': {
                                color: '#FF8C00',
                            }
                        },
                        '& .MuiInputBase-input': {
                            color: '#001F3F',
                            fontSize: '1.1rem',
                            textAlign: 'center',
                        }
                    }}
                />

                <Box sx={{ 
                    position: 'relative',
                    minHeight: '48px',
                    mt: 'auto',
                    overflow: 'hidden'
                }}>
                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={teamName.length < 3 || !!nameError || isSubmitting}
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: 48,
                            background: 'linear-gradient(135deg, #FF8C00 0%, #E67E00 100%)',
                            color: 'white',
                            fontWeight: 600,
                            borderRadius: 2,
                            textTransform: 'none',
                            fontSize: '1.1rem',
                            opacity: teamName.length >= 3 && !nameError ? 1 : 0,
                            visibility: teamName.length >= 3 && !nameError ? 'visible' : 'hidden',
                            transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                            backdropFilter: 'blur(8px)',
                            transform: teamName.length >= 3 && !nameError ? 'scale(1)' : 'scale(0.95)',
                            filter: teamName.length >= 3 && !nameError ? 
                                'blur(0) brightness(1)' : 
                                'blur(10px) brightness(1.2)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #E67E00 0%, #CC7000 100%)',
                                transform: teamName.length >= 3 && !nameError ? 
                                    'scale(1.02)' : 
                                    'scale(0.95)',
                                boxShadow: '0 6px 20px rgba(255, 140, 0, 0.2)',
                            }
                        }}
                    >
                        Add Team
                    </Button>
                </Box>
            </Box>
        </Paper>
    );
}; 