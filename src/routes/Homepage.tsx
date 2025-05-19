import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  useTheme,
  useMediaQuery,
  Avatar,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import Slider from "react-slick";
import { motion } from "framer-motion";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import kit from "../assets/images/Kit.webp";
import Ball from "../assets/images/ball.jpg";
import Bat from "../assets/images/bat.webp";
import MIRC24 from "../assets/images/MIRC24.webp";
import RC24 from "../assets/images/RC24.jpg";
import RCControl from "../assets/images/RCControls.webp";
import { LoadingScreen } from "../components/LoadingScreen";
import { useTournamentContext } from "../context/TournamentContext";

const carouselImages = [RC24, MIRC24, RCControl];

const equipments = [
  { name: "Cricket Bat", image: Bat },
  { name: "Cricket Ball", image: Ball },
  { name: "Player Kit", image: kit },
];

const features = [
  {
    title: "Live Scores",
    desc: "Track every ball with real-time score updates from global matches.",
    icon: "📡",
  },
  {
    title: "Match Analysis",
    desc: "In-depth commentary, over breakdowns, and session stats.",
    icon: "📊",
  },
  {
    title: "Global Coverage",
    desc: "Follow ICC, bilateral series, and franchise leagues around the world.",
    icon: "🌍",
  },
];

const floatingItems = [
  { icon: "🏏", label: "Bat", size: 60, initialX: 2, initialY: 20, delay: 0 },
  { icon: "🥎", label: "Ball", size: 55, initialX: 90, initialY: 35, delay: 1 },
  {
    icon: "🧤",
    label: "Gloves",
    size: 50,
    initialX: 45,
    initialY: 60,
    delay: 2,
  },
  {
    icon: "🎽",
    label: "Jersey",
    size: 65,
    initialX: 80,
    initialY: 80,
    delay: 1.5,
  },
  { icon: "🥎", label: "Ball", size: 55, initialX: 1, initialY: 40, delay: 1 },
];

const floatAnimation = {
  y: ["0%", "20%", "0%", "-15%", "0%"],
  x: ["0%", "15%", "0%", "-10%", "0%"],
  rotate: [0, 15, -15, 20, 0],
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [width, height] = useWindowSize();
  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = React.useState(true);
  const [selectedTeam, setSelectedTeam] = React.useState(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [stats, setStats] = React.useState([
    { label: "Matches Covered", value: 342 },
    { label: "Runs Recorded", value: 58200 },
    { label: "Wickets Tracked", value: 1140 },
  ]);
  const [liveMatchInfo, setLiveMatchInfo] = React.useState({
    team1: {
      name: "",
      runs: "",
      wickets: "",
      overs: "",
      logo: "",
    },
    team2: {
      runs: "",
      wickets: "",
      overs: "",
      name: "",
      logo: "",
    },
    matchType: "",
  });

  const { tournament } = useTournamentContext();

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
  };
  useEffect(() => {
    if (tournament.pointsTable.length !== 0) {
      const { pointsTable, matchesCompleted } = tournament;
      const recentMatch = tournament.matches.filter(
        (match) => match.status === "completed"
      )[0];
      let runsScored = 0;
      let wicketsTaken = 0;
      pointsTable.forEach((team) => {
        runsScored += team.runsScored;
        wicketsTaken += team.wicketsTaken;
      });
      setLiveMatchInfo({
        team1: {
          name: recentMatch?.team1?.name,
          runs: recentMatch?.result?.team1Score.runs,
          wickets: recentMatch?.result?.team1Score.wickets,
          overs: recentMatch?.result?.team1Score.overs,
          logo: recentMatch?.team1?.logo,
        },
        team2: {
          name: recentMatch?.team2?.name,
          runs: recentMatch?.result?.team2Score.runs,
          wickets: recentMatch?.result?.team2Score.wickets,
          overs: recentMatch?.result?.team2Score.overs,
          logo: recentMatch?.team2?.logo,
        },
        matchType: recentMatch?.matchType,
      });
      setStats([
        { label: "Matches Covered", value: matchesCompleted },
        { label: "Runs Recorded", value: runsScored },
        { label: "Wickets Tracked", value: wicketsTaken },
      ]);
    }
  }, [tournament]);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleTeamClick = (team: any) => {
    setSelectedTeam(team);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false); // hide after done
    }, 2000); // adjust timing as needed
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTeam(null);
  };

  console.log(selectedTeam);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        position: "relative",
        minHeight: "calc(100vh - 180px)",
        width: "100vw",
      }}
    >
      {showConfetti && (
        <Confetti width={width} height={height} numberOfPieces={1000} />
      )}
      {floatingItems.map(
        ({ icon, label, size, initialX, initialY, delay }, i) => (
          <motion.div
            key={i}
            aria-label={label}
            role="img"
            style={{
              position: "fixed",
              top: `${initialY}vh`,
              left: `${initialX}vw`,
              fontSize: size,
              pointerEvents: "none",
              userSelect: "none",
              zIndex: 0,
              filter:
                "drop-shadow(0 0 12px rgba(255, 69, 0, 0.9)) drop-shadow(0 0 20px rgba(255, 140, 0, 0.7))",
              color: "#ff4500",
            }}
            animate={floatAnimation}
            transition={{
              duration: 12 + i * 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "mirror",
              delay,
            }}
          >
            {icon}
          </motion.div>
        )
      )}

      <Container
        maxWidth="lg"
        sx={{
          mt: { xs: 2, md: 4 },
          px: { xs: 1, md: 3 },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Slider {...sliderSettings}>
          {carouselImages.map((src, i) => (
            <Box
              key={i}
              sx={{
                width: "100%",
                height: isMobile ? 200 : 450,
                borderRadius: 2,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <Box
                component="img"
                src={src}
                alt={`carousel-${i}`}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  userSelect: "none",
                  pointerEvents: "none",
                  display: "block",
                }}
                loading="lazy"
              />
            </Box>
          ))}
        </Slider>

        <Typography
          variant={isMobile ? "h5" : "h4"}
          align="center"
          sx={{
            color: "#001838",
            fontWeight: 600,
            mb: 3,
            textAlign: "center",
          }}
        >
          Welcome to CricketTrack – The Game, Live.
        </Typography>
        <Typography
          align="center"
          color="text.secondary"
          sx={{ mb: 4, px: isMobile ? 2 : 0 }}
        >
          A unified platform for live cricket scores, global coverage,
          analytics, and cricket passion.
        </Typography>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            borderRadius: 2,
            width: "100%",
            mx: "auto",
            maxWidth: "100%",
          }}
        >
          <Stack
            direction={isMobile ? "column" : "row"}
            alignItems="center"
            justifyContent="center"
            spacing={isMobile ? 1 : 2}
            flexWrap="wrap"
          >
            {/* Title */}
            <Typography
              variant="h6"
              fontWeight="bold"
              textTransform={"capitalize"}
              sx={{ color: "#e53935", textAlign: isMobile ? "center" : "left" }}
            >
              🏏 Live {liveMatchInfo.matchType} Match:
            </Typography>

            {/* Team 1 */}
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h6" fontWeight="bold">
                {liveMatchInfo.team1.name}
              </Typography>
              <Avatar
                src={liveMatchInfo.team1.logo}
                alt="Team1 Logo"
                sx={{ width: 24, height: 24 }}
              />
              <Typography fontSize="1rem" fontWeight="medium">
                {liveMatchInfo.team1.runs}/{liveMatchInfo.team1.wickets}
              </Typography>
            </Box>

            {/* VS */}
            <Typography
              variant="h6"
              fontWeight="medium"
              color="text.secondary"
              sx={{ mx: isMobile ? 0 : 1 }}
            >
              vs
            </Typography>

            {/* Team 2 */}
            <Box display="flex" alignItems="center" gap={1}>
              <Typography variant="h6" fontWeight="bold">
                {liveMatchInfo.team2.name}
              </Typography>
              <Avatar
                src={liveMatchInfo.team2.logo}
                alt="Team2 Logo"
                sx={{ width: 24, height: 24 }}
              />
              <Typography fontSize="1rem" fontWeight="medium">
                {liveMatchInfo.team2.runs}/{liveMatchInfo.team2.wickets}
              </Typography>
            </Box>
          </Stack>
        </Paper>

        <Typography variant={isMobile ? "h6" : "h5"} sx={{ mt: 6, mb: 3 }}>
          💡 Key Features
        </Typography>
        <Grid container spacing={3}>
          {features.map((item, i) => (
            <Grid item xs={12} md={4} key={i}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.2 }}
              >
                <Paper
                  elevation={4}
                  sx={{ p: 3, borderRadius: 3, textAlign: "center" }}
                >
                  <Typography fontSize={40}>{item.icon}</Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Container maxWidth="lg" sx={{ mt: 6 }}>
          <Typography variant={isMobile ? "h6" : "h5"} sx={{ mb: 2 }}>
            🏏 Registered Teams
          </Typography>
          <Grid container spacing={3}>
            {tournament.teams.map((team, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <Card
                  sx={{ cursor: "pointer", p: 2, borderRadius: 3 }}
                  onClick={() => handleTeamClick(team)}
                >
                  <Stack
                    direction="row"
                    spacing={2}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={team.logo}
                        alt={team.name}
                        sx={{ width: 56, height: 56 }}
                      />
                      <Typography variant="h6">{team.name}</Typography>
                    </Stack>
                    <VisibilityIcon
                      sx={{ cursor: "pointer", color: "primary.main" }}
                      onClick={() => handleTeamClick(team)}
                    />
                  </Stack>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>

        <Typography variant={isMobile ? "h6" : "h5"} sx={{ mt: 6, mb: 2 }}>
          📊 Platform Stats
        </Typography>
        <Grid container spacing={3}>
          {stats.map((stat, i) => (
            <Grid item xs={12} sm={4} key={i}>
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.2 }}
              >
                <Paper
                  elevation={4}
                  sx={{ p: 4, borderRadius: 3, textAlign: "center" }}
                >
                  <Typography variant="h4" color="primary">
                    {stat.value}
                  </Typography>
                  <Typography variant="subtitle1">{stat.label}</Typography>
                </Paper>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Typography variant={isMobile ? "h6" : "h5"} sx={{ mt: 6, mb: 2 }}>
          🧢 Cricket Gear Showcase
        </Typography>
        <Grid container spacing={3}>
          {equipments.map((item, i) => (
            <Grid item xs={12} sm={4} key={i}>
              <Card sx={{ maxWidth: 345, borderRadius: 3 }}>
                <CardMedia
                  component="img"
                  height="180"
                  image={item.image}
                  alt={item.name}
                />
                <CardContent>
                  <Typography variant="h6" component="div">
                    {item.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Paper
          elevation={6}
          sx={{
            mt: 8,
            p: 4,
            borderRadius: 3,
            textAlign: "center",
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }}
        >
          <Typography variant={isMobile ? "h6" : "h5"} sx={{ mb: 2 }}>
            Ready to explore live cricket like never before?
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/schedule")}
            sx={{ fontWeight: "bold" }}
          >
            Go to Schedule
          </Button>
        </Paper>
      </Container>
      {isLoading && <LoadingScreen />}

      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="lg"
        fullWidth
        sx={{ "& .MuiDialog-paper": { width: "900px", maxWidth: "95%" } }}
      >
        <DialogTitle>Team Details</DialogTitle>
        <DialogContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {selectedTeam && (
            <>
              <Stack spacing={2} mt={1} sx={{ width: "100%", maxWidth: 400 }}>
                <Typography variant="h6" gutterBottom>
                  {selectedTeam.name}
                </Typography>
                <Avatar
                  src={selectedTeam.logo}
                  alt={selectedTeam.name}
                  sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
                />
                <Typography>
                  <strong>Captain:</strong> {selectedTeam.captain}
                </Typography>
                <Typography>
                  <strong>Coach:</strong> {selectedTeam.coach}
                </Typography>
                <Typography>
                  <strong>City:</strong> {selectedTeam.city}
                </Typography>
                <Typography>
                  <strong>Total Wins:</strong> {selectedTeam.totalWins}
                </Typography>
                <Typography>
                  <strong>Team Size:</strong> {selectedTeam.teamSize}
                </Typography>
                <Typography>
                  <strong>Date of Birth:</strong> {selectedTeam.dob}
                </Typography>
                <Typography sx={{ mt: 2, mb: 1 }}>
                  <strong>Players:</strong>
                </Typography>
                11
              </Stack>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HomePage;
