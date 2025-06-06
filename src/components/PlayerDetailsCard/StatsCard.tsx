import {
    Box,
    Typography,
    Grid,
    Paper,
    LinearProgress,
} from '@mui/material';
import { Performance, TeamStats } from "../../types";
import { getFormattedPerformance } from '../../utils/matchUtils';


interface DynamicStatsTableProps {
    playerStats: TeamStats;
}

const StatCard = ({ label, value, formattedValue }: { label: string; value?: string | number, formattedValue?: React.ReactNode; }) => {
    return (
        <Paper
            elevation={3}
            sx={{
                p: 2,
                textAlign: 'center',
                borderRadius: 3,
                minHeight: 100,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                background:
                    'linear-gradient(145deg, #ffffff, #f0f0f0)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    transform: 'translateY(-3px)',
                    boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
                },
            }}
        >
            <Typography variant="body2" color="textSecondary">
                {label}
            </Typography>
            <Typography variant="h6" fontWeight="bold" color="orange">
                {formattedValue ?? value ?? "-"}
            </Typography>
        </Paper>
    );
};


const formatPerformance = (perf: Performance, type: string): React.ReactNode => {
    if (!perf) return "-";

    const score = getFormattedPerformance(perf, type);
    const opponentName = perf.opponent.split(" ")[0]; // Extract first nam

    return (
        <div style={{ textAlign: "center" }}>
            <div style={{ fontWeight: "bold", fontSize: "1.25rem", color: "#ff9800" }}>
                {score}
            </div>
            <div style={{ fontSize: "0.75rem", fontStyle: "italic", color: "#777" }}>
                vs {opponentName}
            </div>
        </div>
    );
};


const PlayerSummaryStats = ({ playerStats }: DynamicStatsTableProps) => {
    const {
        matches,
        wins,
        losses,
        ties,
        runsScored,
        runsConceded,
        oversPlayed,
        oversBowled,
        wicketsTaken,
        numOfFiftyPlusScores,
        numofFivePlusWickets,
        bestBattingPerformance,
        bestBowlingPerformance
    } = playerStats;

    const winRate = matches ? ((wins / matches) * 100).toFixed(1) : '0';
    const runRate = oversPlayed ? (runsScored / oversPlayed).toFixed(2) : '-';
    const economy = oversBowled ? (runsConceded / oversBowled).toFixed(2) : '-';
    const avgRuns = matches ? (runsScored / matches).toFixed(2) : '-';
    const avgWickets = matches ? (wicketsTaken / matches).toFixed(2) : '-';
    const stats = [
        { label: "Matches", value: matches },
        { label: "Wins", value: wins },
        { label: "Ties", value: ties },
        { label: "Losses", value: losses },
        { label: "Runs Scored", value: runsScored },
        { label: "Run Rate", value: runRate },
        { label: "Wickets Taken", value: wicketsTaken },
        { label: "Avg Runs/Match", value: avgRuns },
        { label: "Avg Wickets/Match", value: avgWickets },
        { label: "Economy", value: economy },
        { label: "50+ Scores", value: numOfFiftyPlusScores },
        { label: "5+ Wickets", value: numofFivePlusWickets },
    ];




    return (
        <Box p={2}>
            <Grid container spacing={2}>
                {stats
                    .filter(stat => Number(stat.value) > 0)
                    .map((stat, index) => (
                        <Grid item xs={6} sm={4} key={index}>
                            <StatCard label={stat.label} value={stat.value} />
                        </Grid>
                    ))}
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <StatCard
                            label="Best Batting"
                            formattedValue={formatPerformance(bestBattingPerformance, 'batting')}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <StatCard
                            label="Best Bowling"
                            formattedValue={formatPerformance(bestBowlingPerformance, 'bowling')}
                        />
                    </Grid>
                </Grid>



            </Grid>

            <Box mt={4}>
                <Typography variant="body2" fontWeight="bold" mb={1}>
                    Win Rate: {winRate}%
                </Typography>
                <LinearProgress
                    variant="determinate"
                    value={parseFloat(winRate)}
                    sx={{
                        height: 12,
                        borderRadius: 6,
                        '& .MuiLinearProgress-bar': {
                            backgroundColor: '#ffa500',
                        },
                    }}
                />
            </Box>
        </Box>
    );
}


export default PlayerSummaryStats;
