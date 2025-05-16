import React, { useState, useRef } from 'react';
import { Button, Box, FormControl, Select, MenuItem, Typography, Paper, CircularProgress, Alert, Snackbar } from '@mui/material';
import { Team, ScoreboardData, TeamMapping, Match } from '../types';
import Tesseract from 'tesseract.js';

// Environment check for production
const isProduction = process.env.NODE_ENV === 'production';

interface Props {
    teams: Team[];
    onScoreSubmit: (matchData: Partial<Match>) => void;
}

interface ExtractedTeamScore {
    name: string;
    runs: number;
    wickets: number;
    overs: number;
}

export const ScoreboardUploader: React.FC<Props> = ({ teams, onScoreSubmit }) => {
    // If in production, return null to hide the component
    if (isProduction) {
        return null;
    }

    const [isProcessing, setIsProcessing] = useState(false);
    const [screenshot, setScreenshot] = useState<string | null>(null);
    const [extractedData, setExtractedData] = useState<ScoreboardData | null>(null);
    const [teamMappings, setTeamMappings] = useState<TeamMapping[]>([]);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setError(null);
        setIsProcessing(true);
        setExtractedData(null);
        setTeamMappings([]);

        try {
            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setScreenshot(e.target?.result as string);
            };
            reader.readAsDataURL(file);

            // Process with Tesseract with improved settings
            const result = await Tesseract.recognize(file, 'eng', {
                logger: m => console.log('Tesseract progress:', m),
                // Remove unsupported options
            });
            
            // Log the raw extracted text and clean it
            console.log('Raw extracted text:', result.data.text);
            
            // Clean and preprocess the text
            const cleanedText = result.data.text
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0) // Remove empty lines
                .join('\n');
            
            console.log('Cleaned text:', cleanedText);
            console.log('Text lines:', cleanedText.split('\n'));
            
            // Parse the text to extract scoreboard data
            const data = parseScoreboardText(cleanedText);
            
            if (data.teams.length !== 2) {
                throw new Error('Could not detect exactly two teams from the screenshot');
            }
            
            setExtractedData(data);

            // Initialize team mappings
            setTeamMappings(data.teams.map(team => ({
                screenTeamName: team.name,
                actualTeam: teams[0]
            })));

            return; // Add explicit return for void function
        } catch (error) {
            console.error('Error processing screenshot:', error);
            setError(error instanceof Error ? error.message : 'Failed to process screenshot');
        } finally {
            setIsProcessing(false);
        }
    };

    const validateOvers = (overs: number): number => {
        // Ensure overs is not negative
        if (overs < 0) return 0;
        
        // Get the integer and decimal parts
        const integerPart = Math.floor(overs);
        const decimalPart = overs % 1;
        
        // Validate decimal part (should be between 0 and 0.5)
        if (decimalPart > 0.5) {
            return integerPart + 0.5;
        }
        
        return overs;
    };

    const parseScoreboardText = (text: string): ScoreboardData => {
        const lines = text.split('\n').map(line => line.trim());
        const extractedTeams: ExtractedTeamScore[] = [];
        
        console.log('Starting to process lines. Total lines:', lines.length);
        console.log('All lines:', lines);

        let firstInningsFound = false;
        let secondInningsFound = false;

        // Process each line
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].replace(/\s+/g, ' ').trim().toUpperCase();
            console.log(`\nProcessing line ${i}:`, line);

            // Look for team name followed by overs and score on the same line
            // Format: "TEAM NAME     5.0 OVERS     57-2"
            const scoreLinePattern = /^([A-Z]+)\s+(\d+\.?\d*)\s*OVERS\s+(\d+)-(\d+)/i;
            const scoreMatch = line.match(scoreLinePattern);

            if (scoreMatch) {
                console.log('Found score line match:', scoreMatch);
                const [_, teamName, overs, runs, wickets] = scoreMatch;

                const teamScore: ExtractedTeamScore = {
                    name: teamName,
                    runs: parseInt(runs),
                    wickets: parseInt(wickets),
                    overs: validateOvers(parseFloat(overs))
                };

                console.log('Processed team score:', teamScore);

                if (!firstInningsFound) {
                    firstInningsFound = true;
                    extractedTeams[0] = teamScore;
                    console.log('Saved as first innings');
                } else if (!secondInningsFound) {
                    secondInningsFound = true;
                    extractedTeams[1] = teamScore;
                    console.log('Saved as second innings');
                }
            }
        }

        // If we haven't found both innings, try an alternative approach
        if (!firstInningsFound || !secondInningsFound) {
            console.log('Trying alternative parsing approach...');
            
            // Reset the arrays and flags
            extractedTeams.length = 0;
            firstInningsFound = false;
            secondInningsFound = false;

            // Look for lines with just the team name first
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i].replace(/\s+/g, ' ').trim().toUpperCase();
                
                // Skip header lines
                if (line.includes('END OF') || line.length === 0) {
                    continue;
                }

                // Look for a line that has just the team name
                const teamNamePattern = /^([A-Z]+)$/;
                const teamMatch = line.match(teamNamePattern);

                if (teamMatch) {
                    const teamName = teamMatch[1];
                    console.log('Found team name:', teamName);

                    // Look ahead for score information
                    for (let j = i; j < Math.min(i + 3, lines.length); j++) {
                        const scoreLine = lines[j].replace(/\s+/g, ' ').trim().toUpperCase();
                        
                        // Look for overs and score pattern
                        const scorePattern = /(\d+\.?\d*)\s*OVERS\s+(\d+)-(\d+)/i;
                        const scoreMatch = scoreLine.match(scorePattern);

                        if (scoreMatch) {
                            const [_, overs, runs, wickets] = scoreMatch;
                            const teamScore: ExtractedTeamScore = {
                                name: teamName,
                                runs: parseInt(runs),
                                wickets: parseInt(wickets),
                                overs: validateOvers(parseFloat(overs))
                            };

                            console.log('Found score for team:', teamScore);

                            if (!firstInningsFound) {
                                firstInningsFound = true;
                                extractedTeams[0] = teamScore;
                                console.log('Saved as first innings');
                            } else if (!secondInningsFound) {
                                secondInningsFound = true;
                                extractedTeams[1] = teamScore;
                                console.log('Saved as second innings');
                            }
                            break;
                        }
                    }
                }
            }
        }

        // Log the final state
        console.log('\nFinal state:', {
            firstInningsFound,
            secondInningsFound,
            extractedTeams
        });

        // Validate that we found both innings
        if (!firstInningsFound || !secondInningsFound) {
            console.error('Missing innings data:', { firstInningsFound, secondInningsFound });
            throw new Error('Could not find scores for both teams in the header sections');
        }

        // Return the extracted data
        return {
            teams: extractedTeams.map(team => ({
                name: team.name,
                score: {
                    runs: team.runs,
                    wickets: team.wickets,
                    overs: team.overs
                },
                players: []
            })),
            result: ''
        };
    };

    const handleTeamMapping = (screenTeamName: string, actualTeamId: string) => {
        setTeamMappings(prev => prev.map(mapping => 
            mapping.screenTeamName === screenTeamName
                ? { ...mapping, actualTeam: teams.find(t => t.id === actualTeamId)! }
                : mapping
        ));
    };

    const handleSubmit = () => {
        if (!extractedData || teamMappings.length !== 2) {
            setError('Invalid data for submission');
            return;
        }

        try {
            const battingFirstMapping = teamMappings[0]; // First team in the screenshot
            const battingSecondMapping = teamMappings[1]; // Second team in the screenshot
            const battingFirstScore = extractedData.teams[0].score;
            const battingSecondScore = extractedData.teams[1].score;

            if (!battingFirstScore || !battingSecondScore) {
                throw new Error('Could not find scores for both teams');
            }

            console.log('Submitting match data:', {
                battingFirst: {
                    team: battingFirstMapping.actualTeam.name,
                    score: battingFirstScore
                },
                battingSecond: {
                    team: battingSecondMapping.actualTeam.name,
                    score: battingSecondScore
                }
            });

            // Calculate run rates
            const team1RunRate = battingFirstScore.runs / battingFirstScore.overs;
            const team2RunRate = battingSecondScore.runs / battingSecondScore.overs;

            // Determine winner based on runs
            let winner: Team | undefined;
            let result: 'win' | 'tie' | 'loss';

            if (battingFirstScore.runs === battingSecondScore.runs) {
                result = 'tie';
                winner = undefined;
            } else {
                result = 'win';
                winner = battingFirstScore.runs > battingSecondScore.runs 
                    ? battingFirstMapping.actualTeam 
                    : battingSecondMapping.actualTeam;
            }

            const matchData: Partial<Match> = {
                team1: battingFirstMapping.actualTeam,
                team2: battingSecondMapping.actualTeam,
                result: {
                    team1Score: battingFirstScore,
                    team2Score: battingSecondScore,
                    result,
                    winner,
                    runRates: {
                        team1: team1RunRate,
                        team2: team2RunRate
                    }
                },
                status: 'completed',
                inningsInfo: {
                    battingFirst: battingFirstMapping.actualTeam,
                    date: new Date(),
                    time: new Date().toLocaleTimeString(),
                    tossWinner: battingFirstMapping.actualTeam,
                    tossDecision: 'bat'
                }
            };

            onScoreSubmit(matchData);
        } catch (error) {
            console.error('Error submitting data:', error);
            setError(error instanceof Error ? error.message : 'Failed to submit score data');
        }
    };

    return (
        <Paper sx={{ p: 3, mb: 3 }}>
            
            <Box sx={{ mb: 2 }}>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                    ref={fileInputRef}
                />
                <Button
                    variant="contained"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isProcessing}
                >
                    Select Screenshot
                </Button>
            </Box>

            {isProcessing && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CircularProgress size={24} />
                    <Typography>Processing screenshot...</Typography>
                </Box>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {screenshot && (
                <Box sx={{ mb: 2 }}>
                    <img src={screenshot} alt="Uploaded scoreboard" style={{ maxWidth: '100%', height: 'auto' }} />
                </Box>
            )}

            {extractedData && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        Confirm Match Details
                    </Typography>
                    
                    <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            First Innings
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <FormControl sx={{ width: '60%' }}>

                                <Select
                                    size="small"
                                    value={teamMappings[0]?.actualTeam.id || ''}
                                    onChange={(e) => handleTeamMapping(teamMappings[0].screenTeamName, e.target.value)}
                                >
                                    {teams.map((team) => (
                                        <MenuItem key={team.id} value={team.id}>
                                            {team.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Score: {extractedData.teams[0].score.runs}/{extractedData.teams[0].score.wickets}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Overs: {extractedData.teams[0].score.overs}
                                </Typography>
                            </Box>
                        </Box>

                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Second Innings
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <FormControl sx={{ width: '60%' }}>
                               
                                <Select
                                    size="small"
                                    value={teamMappings[1]?.actualTeam.id || ''}
                                    onChange={(e) => handleTeamMapping(teamMappings[1].screenTeamName, e.target.value)}
                                >
                                    {teams.map((team) => (
                                        <MenuItem key={team.id} value={team.id}>
                                            {team.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Box>
                                <Typography variant="body2" color="text.secondary">
                                    Score: {extractedData.teams[1].score.runs}/{extractedData.teams[1].score.wickets}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Overs: {extractedData.teams[1].score.overs}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>

                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={teamMappings.length === 0}
                        fullWidth
                    >
                        Submit Score
                    </Button>
                </Box>
            )}

            <Snackbar
                open={Boolean(error)}
                autoHideDuration={6000}
                onClose={() => setError(null)}
            >
                <Alert severity="error" onClose={() => setError(null)}>
                    {error}
                </Alert>
            </Snackbar>
        </Paper>
    );
}; 