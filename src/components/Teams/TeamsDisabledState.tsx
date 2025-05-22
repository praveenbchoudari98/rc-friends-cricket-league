import { Box, Typography, Paper } from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import type { FirestoreDocument, Team } from '../../types';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useNavigate } from 'react-router/dist';

interface TeamsDisabledStateProps {
    teams: Team[];
}

const TeamsDisabledState = ({ teams }: TeamsDisabledStateProps) => {
    const navigate = useNavigate();
    const exportCollectionToJSON = async (collectionName: string) => {
        try {
            const snapshot = await getDocs(collection(db, collectionName));
            const data: FirestoreDocument[] = [];

            snapshot.forEach(doc => {
                data.push({ id: doc.id, ...doc.data() });
            });

            // Convert to JSON and trigger download
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${collectionName}_backup.json`;
            link.click();

            console.log(`✅ Exported ${data.length} docs from ${collectionName}`);
        } catch (error) {
            console.error('❌ Error exporting collection:', error);
        }
    }

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Registered Teams Section */}
            {/* <Box>
                <Typography
                    variant="h5"
                    sx={{
                        color: '#001838',
                        fontWeight: 600,
                        mb: 3,
                        textAlign: 'center'
                    }}
                >
                    Registered Teams
                </Typography>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(4, 1fr)'
                        },
                        gap: 3,
                        justifyItems: 'center'
                    }}
                >
                    {teams.map((team) => (
                        <Paper
                            key={team.id}
                            elevation={0}
                            sx={{
                                p: 3,
                                width: '100%',
                                maxWidth: 280,
                                borderRadius: 2,
                                backgroundColor: 'white',
                                border: '1px solid rgba(0, 0, 0, 0.08)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                                transition: 'transform 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)'
                                }
                            }}
                        >
                            <Box
                                component="img"
                                src={team.logo}
                                alt={team.name}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    border: '3px solid #f0f0f0',
                                    padding: '4px'
                                }}
                            />
                            <Typography
                                variant="h6"
                                sx={{
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    color: '#001838',
                                    textAlign: 'center'
                                }}
                            >
                                {team.name}
                            </Typography>
                        </Paper>
                    ))}
                </Box>
            </Box> */}

            {/* Disabled State Message */}
            <Paper
                elevation={0}
                sx={{
                    p: 6,
                    textAlign: 'center',
                    borderRadius: 4,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(8px)',
                    border: '2px dashed rgba(0, 0, 0, 0.12)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 3,
                    marginTop: 4,
                    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s ease-in-out',  
                    '&:hover': {
                        transform: 'scale(1.02)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
                    }
                }}
            >
                <Box sx={{
                    width: 120,
                    height: 120,
                    borderRadius: '50%',
                    backgroundColor: 'rgba(255, 140, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 2
                }}>
                    <Box sx={{ position: 'relative' }}>
                        <SportsCricketIcon
                            onClick={() => exportCollectionToJSON('tournaments')}
                            sx={{
                                fontSize: 60,
                                color: '#FF8C00',
                                opacity: 0.7
                            }}
                        />
                        <LockIcon
                            sx={{
                                position: 'absolute',
                                bottom: -10,
                                right: -10,
                                fontSize: 24,
                                color: '#FF8C00',
                                backgroundColor: 'white',
                                borderRadius: '50%',
                                padding: '4px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                            }}
                        />
                    </Box>
                </Box>

                <Box>
                    <Typography
                        variant="h5"
                        sx={{
                            color: '#001838',
                            fontWeight: 600,
                            mb: 1
                        }}
                    >
                        Tournament in Progress
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: '#666666',
                            maxWidth: 400,
                            mx: 'auto'
                        }}
                    >
                        Teams cannot be added or removed while the tournament is ongoing.
                        Please wait for the current tournament to complete.
                    </Typography>
                </Box>

                <Box
                    sx={{
                        mt: 2,
                        p: 2,
                        backgroundColor: 'rgba(255, 140, 0, 0.05)',
                        borderRadius: 2,
                        border: '1px solid rgba(255, 140, 0, 0.1)'
                    }}
                >
                    <Typography
                        variant="body2"
                        sx={{
                            color: '#FF8C00',
                            fontWeight: 500
                        }}
                        onClick={() => navigate("/schedule")}
                    >
                        
                        Head over to the Schedule page to view tournament progress
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default TeamsDisabledState; 