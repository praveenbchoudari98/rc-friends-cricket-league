import {
    Box,
    Typography,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Container,
    Divider
} from '@mui/material';
import SportsIcon from '@mui/icons-material/Sports';
import TimerIcon from '@mui/icons-material/Timer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import InfoIcon from '@mui/icons-material/Info';
import GroupsIcon from '@mui/icons-material/Groups';
import EventNoteIcon from '@mui/icons-material/EventNote';
import BarChartIcon from '@mui/icons-material/BarChart';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import ErrorIcon from '@mui/icons-material/Error';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { FirestoreDocument } from '../../types';

export const About = () => {
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
        <Container maxWidth="md">
            <Box sx={{ py: 4 }}>
                <Typography
                    variant="h4"
                    sx={{
                        color: '#001838',
                        fontWeight: 700,
                        mb: 3,
                        textAlign: 'center'
                    }}
                >
                    About RC Friends Cricket League
                </Typography>

                <Paper
                    elevation={2}
                    sx={{
                        p: 3,
                        mb: 4,
                        borderRadius: 2,
                        bgcolor: '#fff'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <GroupsIcon sx={{ color: '#FF6B00', fontSize: 28 }} />
                        <Typography variant="h6" sx={{ color: '#001838' }}>
                            Tournament Overview
                        </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: '#666', mb: 2 }}>
                        RC Friends Cricket League 25 (RCPL 25) is a mobile cricket game tournament that brings together teams for competitive cricket matches.
                        The tournament consists of a league stage followed by playoffs to determine the champion.
                    </Typography>
                </Paper>

                <Paper
                    elevation={2}
                    sx={{
                        p: 3,
                        mb: 4,
                        borderRadius: 2,
                        bgcolor: '#fff'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <EventNoteIcon sx={{ color: '#FF6B00', fontSize: 28 }} />
                        <Typography variant="h6" sx={{ color: '#001838' }}>
                            Tournament Structure & Scheduling
                        </Typography>
                    </Box>

                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <SportsCricketIcon sx={{ color: '#FF6B00' }} />
                            </ListItemIcon>
                            <ListItemText
                                primary="Match Configuration"
                                secondary="At the start of the tournament, you can configure how many times each team will play against every other team (1-5 matches per team pair). This determines the total number of league matches."
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem>
                            <ListItemIcon>
                                <EventNoteIcon sx={{ color: '#FF6B00' }} />
                            </ListItemIcon>
                            <ListItemText
                                primary="League Stage Schedule"
                                secondary="The schedule ensures each team plays an equal number of matches against every other team. For example, if you select 2 matches per team pair, Team A will play exactly 2 matches against Team B, Team C, and so on."
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem>
                            <ListItemIcon>
                                <BarChartIcon sx={{ color: '#FF6B00' }} />
                            </ListItemIcon>
                            <ListItemText
                                primary="Tournament Progression"
                                secondary="Teams must complete all their league matches before playoffs begin. The top team automatically qualifies for the finals, while the 2nd and 3rd placed teams compete in a qualifier match."
                            />
                        </ListItem>
                    </List>
                </Paper>

                <Paper
                    elevation={2}
                    sx={{
                        p: 3,
                        borderRadius: 2,
                        bgcolor: '#fff'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <InfoIcon sx={{ color: '#FF6B00', fontSize: 28 }}

                        />
                        <Typography variant="h6" sx={{ color: '#001838' }} >
                            Tournament Rules & Conditions
                        </Typography>
                    </Box>

                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <SportsIcon sx={{ color: '#FF6B00' }} />
                            </ListItemIcon>
                            <ListItemText
                                primary="League Stage Points"
                                secondary={`• 2 points for a win\n• 1 point for a tie\n• 0 points for a loss\n• Teams are ranked by points, with Net Run Rate (NRR) as tiebreaker\n• League matches can end in a tie`}
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem>
                            <ListItemIcon>
                                <TimerIcon sx={{ color: '#FF6B00' }} />
                            </ListItemIcon>
                            <ListItemText
                                primary="Super Duper Over"
                                secondary={`• Only applies to qualifier and finals matches\n• If match ends in a tie, a 2-over Super Duper Over is played\n• Teams can use any number of batsmen and bowlers\n• Team scoring more runs in Super Duper Over wins\n• No restrictions on player selection for Super Duper Over`}
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem>
                            <ListItemIcon>
                                <EmojiEventsIcon sx={{ color: '#FF6B00' }} />
                            </ListItemIcon>
                            <ListItemText
                                primary="Playoffs Structure"
                                secondary={`• Top team directly enters finals\n• 2nd and 3rd placed teams play qualifier match\n• Qualifier winner faces top team in finals\n• Super Duper Over decides tied playoff matches\n• Tournament ends when finals winner is determined`}
                            />
                        </ListItem>
                    </List>
                </Paper>

                <Paper
                    elevation={2}
                    sx={{
                        p: 3,
                        mb: 4,
                        borderRadius: 2,
                        bgcolor: '#fff'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <ErrorIcon sx={{ color: '#FF6B00', fontSize: 28 }} />
                        <Typography variant="h6" sx={{ color: '#001838' }}>
                            Technical Issues & Match Reporting
                        </Typography>
                    </Box>

                    <List>
                        <ListItem>
                            <ListItemIcon>
                                <RestartAltIcon sx={{ color: '#FF6B00' }} />
                            </ListItemIcon>
                            <ListItemText
                                primary="App Issues & Troubleshooting"
                                secondary={`• If you experience any technical issues (crashes, network problems, etc.)\n• Close the app completely\n• Restart the game\n• Start your match from the beginning\n• No match recovery or admin support is provided`}
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                        <ListItem>
                            <ListItemIcon>
                                <WhatsAppIcon sx={{ color: '#FF6B00' }} />
                            </ListItemIcon>
                            <ListItemText
                                primary="Match Score Reporting"
                                secondary={`• After completing each match, take a screenshot of the final match summary/scorecard\n• Share the screenshot immediately in the RC Friends WhatsApp group\n• This is mandatory for all matches to be counted in the tournament\n• Scores will be officially updated based on these screenshots\n• Make sure the screenshot clearly shows both teams' scores and result`}
                            />
                        </ListItem>
                    </List>
                </Paper>
                <button

                    onClick={() => exportCollectionToJSON('tournaments')}
                    style={{
                        padding: "12px 24px",
                        fontSize: "16px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                        transition: "background-color 0.3s ease",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#0056b3")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#007bff")}
                >
                    Download Firestore JSON
                </button>

            </Box>
        </Container>
    );
}; 