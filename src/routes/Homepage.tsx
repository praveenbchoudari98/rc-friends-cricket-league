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
  Avatar,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Slider from "react-slick";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useWindowSize } from "@react-hook/window-size";
import kit from "../assets/images/Kit.webp";
import Ball from "../assets/images/ball.jpg";
import Bat from "../assets/images/bat.webp";
import MIRC24 from "../assets/images/MIRC24.webp";
import RC24 from "../assets/images/RC24.jpg";
import RCControl from "../assets/images/RCControls.webp";
import { useTournamentContext } from "../context/TournamentContext";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Team, TeamStats } from "../types";
import PlayerDetailsCard from "../components/PlayerDetailsCard/PlayerDetailsCard";
import { LoadingScreen } from "../components/LoadingScreen";
import PlayerCard from "./PlayerCard";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import logo from '../assets/logo.png';
import { min } from "cypress/types/lodash";
import { getTeamLogo } from "../utils/matchUtils";

// Carousel images
const carouselImages = [RC24, MIRC24, RCControl];

// Equipments shown in Cricket Gear section
const equipments = [
  { name: "Cricket Bat", image: Bat },
  { name: "Cricket Ball", image: Ball },
  { name: "Player Kit", image: kit },
];

// Features for "What We Offer"
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

// Floating animated cricket icons
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

const computeMetrics = ({
  matches, wins, runsScored, runsConceded,
  oversPlayed, oversBowled, wicketsTaken
}) => {
  const runRate = oversPlayed ? runsScored / oversPlayed : 0;
  const economy = oversBowled ? runsConceded / oversBowled : 0;
  const nrr = oversPlayed && oversBowled
    ? (runsScored / oversPlayed) - (runsConceded / oversBowled)
    : 0;
  return { runRate, economy, nrr };
};

const normalize = (val, max) => max ? val / max : 0;

const computeBestPlayer = (players: TeamStats[]) => {
  const playerMetrics = players.map(player => ({
    original: player,
    ...computeMetrics(player),
  }));

  const max = {
    runsScored: Math.max(...players.map(p => p.runsScored)),
    runRate: Math.max(...playerMetrics.map(p => p.runRate)),
    runsConceded: Math.max(...players.map(p => p.runsConceded)),
    economy: Math.max(...playerMetrics.map(p => p.economy)),
    wicketsTaken: Math.max(...players.map(p => p.wicketsTaken)),
    wins: Math.max(...players.map(p => p.wins)),
    nrr: Math.max(...playerMetrics.map(p => p.nrr)),
  };

  const scored = playerMetrics.map(p => ({
    ...p,
    pes: (
      normalize(p.original.runsScored, max.runsScored) * 15 +
      normalize(p.runRate, max.runRate) * 15 +
      (1 - normalize(p.original.runsConceded, max.runsConceded)) * 10 +
      (1 - normalize(p.economy, max.economy)) * 15 +
      normalize(p.original.wicketsTaken, max.wicketsTaken) * 20 +
      normalize(p.original.wins, max.wins) * 15 +
      normalize(p.nrr, max.nrr) * 10
    )
  }));

  const best = scored.sort((a, b) => b.pes - a.pes)[0];

  return best.original;
};




const HomePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [width, height] = useWindowSize();

  const [isLoading, setIsLoading] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<TeamStats>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [stats, setStats] = useState([
    { label: "Matches Covered", value: 342 },
    { label: "Runs Recorded", value: 58200 },
    { label: "Wickets Tracked", value: 1140 },
  ]);
  const [liveMatchInfo, setLiveMatchInfo] = useState({
    team1: { name: "", runs: "", wickets: "", overs: "", id: "" },
    team2: { runs: "", wickets: "", overs: "", name: "", id: "" },
    matchType: "",
  });
  const [bestPlayer, setBestPlayer] = useState(null);

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
      const recentMatch = tournament.matches.find(
        (match) => match.status === "completed"
      );
      let runsScored = 0;
      let wicketsTaken = 0;
      pointsTable.forEach((team: TeamStats) => {
        runsScored += team.runsScored;
        wicketsTaken += team.wicketsTaken;
      });
      setLiveMatchInfo({
        team1: {
          name: recentMatch?.team1?.name,
          runs: recentMatch?.result?.team1Score.runs,
          wickets: recentMatch?.result?.team1Score.wickets,
          overs: recentMatch?.result?.team1Score.overs,
          id: recentMatch?.team1?.id,
        },
        team2: {
          name: recentMatch?.team2?.name,
          runs: recentMatch?.result?.team2Score.runs,
          wickets: recentMatch?.result?.team2Score.wickets,
          overs: recentMatch?.result?.team2Score.overs,
          id: recentMatch?.team2?.id,
        },
        matchType: recentMatch?.matchType,
      });
      setStats([
        { label: "Matches Covered", value: matchesCompleted },
        { label: "Runs Recorded", value: runsScored },
        { label: "Wickets Tracked", value: wicketsTaken },
      ]);
      setBestPlayer(computeBestPlayer(pointsTable));
    }
  }, [tournament]);


  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleTeamClick = (team: Team) => {
    const selectedTeam = tournament.pointsTable.find(
      (t: TeamStats) => t.team.name === team.name
    );
    const teamDetails = tournament.teamDetails.find(team => team.id === selectedTeam.team.id);
    const selectedTeamDetails = {
      ...selectedTeam,
      teamDetails: teamDetails || null,
    }
    if (!selectedTeam) return;
    setSelectedTeam(selectedTeamDetails);
    setIsLoading(true);
    setDialogOpen(true);
    setTimeout(() => setIsLoading(false), 1200);
  };
  const handleDialogClose = () => {
    setDialogOpen(false);
    setSelectedTeam(null);
  };
  const getMobileOS = (): 'iOS' | 'Android' | 'Other' => {
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;

    const isTouchDevice =
      'ontouchstart' in window || navigator.maxTouchPoints > 0;

    const isSmallScreen =
      window.innerWidth <= 768 || window.innerHeight <= 768;

    // iOS detection
    const isiOS =
      (/iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
      !window.MSStream;

    // Android detection
    const isAndroid = /android/i.test(ua);

    if ((isAndroid || (ua.includes('Linux') && isTouchDevice)) && isSmallScreen) {
      return 'Android';
    }

    if (isiOS && isSmallScreen) {
      return 'iOS';
    }

    return 'Other';
  };




  const handlePlayNow = () => {
    const os = getMobileOS();

    const androidStoreLink = 'https://play.google.com/store/apps/details?id=com.nautilus.realcricket&hl=en_IN&gl=US';
    const iosStoreLink = 'https://apps.apple.com/in/app/real-cricket-24/id1577721431';

    if (os === 'Android') {
      // Android intent or custom URL scheme
      window.location.href = androidStoreLink;
    } else if (os === 'iOS') {
      // iOS custom URL scheme
      window.location.href = iosStoreLink
    } else {
      // Fallback for unsupported platforms
      window.open(androidStoreLink, '_blank');
    }
  };



  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 4,
        position: "relative",
        minHeight: "calc(100vh - 180px)",
        width: "100vw",
        backgroundColor: "#e3f6f5",
        color: "#023e8a",
      }}
    >
      {showConfetti && (
        <Confetti width={width} height={height} numberOfPieces={700} />
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
                "drop-shadow(0 0 8px #48cae4) drop-shadow(0 0 15px #90e0ef)",
              color: "#0077b6",
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
          mt: { xs: 3, md: 5 },
          px: { xs: 2, md: 4 },
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
                height: isMobile ? 220 : 460,
                borderRadius: 3,
                overflow: "hidden",
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)",
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
                }}
                loading="lazy"
              />


            </Box>

          ))}
        </Slider>

        <Typography
          variant={isMobile ? "h4" : "h3"}
          align="center"
          sx={{
            color: "#023e8a",
            fontWeight: 700,
            mt: 4,
            mb: 2,
            textShadow: "1px 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          Welcome to CricketTrack – The Game, Live.
        </Typography>
        <Typography
          align="center"
          sx={{
            mb: 5,
            px: isMobile ? 3 : 8,
            color: "#0077b6",
            fontWeight: 500,
          }}
        >
          A unified platform for live cricket scores, global coverage,
          analytics, and cricket passion.
        </Typography>
        <Box display="flex" justifyContent="center" mt={3}>
          <Button
            onClick={handlePlayNow}
            variant="contained"
            sx={{
              background: "linear-gradient(135deg, #d2f1ff, #a8e4ff)",
              color: "#004c74",
              m: 5,
              borderRadius: "20px",
              boxShadow: "0 4px 10px rgba(0, 123, 255, 0.15)",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "1rem",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
              '&:hover': {
                background: "linear-gradient(135deg, #c0eaff, #90d8ff)",
                transform: "scale(1.03)",
                boxShadow: "0 6px 16px rgba(0, 123, 255, 0.25)"
              },
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              maxWidth: 300,
            }}
          >
            <Box
              component="img"
              src={logo}
              alt="RC24"
              sx={{ width: 24, height: 24, borderRadius: "50%" }}
            />
            <Typography fontWeight="bold" fontSize="1rem">
              Play Now
            </Typography>
            <PlayArrowIcon />
          </Button>
        </Box>

        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 3,
            maxWidth: 900,
            mx: "auto",
            backgroundColor: "#caf0f8",
            color: "#03045e",
          }}
        >
          {liveMatchInfo.matchType ? (
            <Stack
              direction={isMobile ? "column" : "row"}
              alignItems="center"
              justifyContent="space-around"
              spacing={isMobile ? 2 : 4}
            >
              <Typography
                variant="h6"
                fontWeight="700"
                textTransform="capitalize"
                sx={{ color: "#0077b6", textAlign: isMobile ? "center" : "left" }}
              >
                🏏 Live {liveMatchInfo.matchType || "Match"}:
              </Typography>

              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h6" fontWeight="700">
                  {liveMatchInfo.team1.name || "-"}
                </Typography>
                <Avatar
                  src={getTeamLogo(liveMatchInfo.team1.id)}
                  alt="Team1 Logo"
                  sx={{ width: 28, height: 28, border: "2px solid #0077b6" }}
                />
                <Typography fontSize="1rem" fontWeight="600" color="#023e8a">
                  {liveMatchInfo.team1.runs}/{liveMatchInfo.team1.wickets}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontStyle: "italic", color: "#0077b6" }}
                >
                  ({liveMatchInfo.team1.overs} overs)
                </Typography>
              </Stack>
              <Typography
                fontWeight={700}
                variant="h5"
                color="#0077b6"
                sx={{ mx: 2 }}
              >
                vs
              </Typography>

              <Stack direction="row" alignItems="center" spacing={1}>
                <Avatar
                  src={getTeamLogo(liveMatchInfo.team2.id)}
                  alt="Team2 Logo"
                  sx={{ width: 28, height: 28, border: "2px solid #0077b6" }}
                />
                <Typography variant="h6" fontWeight="700">
                  {liveMatchInfo.team2.name || "-"}
                </Typography>
                <Typography fontSize="1rem" fontWeight="600" color="#023e8a">
                  {liveMatchInfo.team2.runs}/{liveMatchInfo.team2.wickets}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontStyle: "italic", color: "#0077b6" }}
                >
                  ({liveMatchInfo.team2.overs} overs)
                </Typography>
              </Stack>
            </Stack>
          )

            : (

              <Typography
                variant="h6"
                fontWeight="700"
                textTransform="capitalize"
                sx={{ color: "#0077b6", textAlign: "center" }}
              >
                No live matches now, but stay tuned for updates!
              </Typography>
            )}
        </Paper>

        <Box mt={6} mb={6}>
          <Typography
            variant="h4"
            fontWeight="700"
            sx={{ color: "#0077b6", mb: 3, textAlign: "center" }}
          >
            Stats at a Glance
          </Typography>
          <Grid
            container
            spacing={3}
            justifyContent="center"
            maxWidth={900}
            mx="auto"
          >
            {stats.map(({ label, value }, i) => (
              <Grid key={i} item xs={12} sm={4}>
                <Paper
                  elevation={3}
                  sx={{
                    py: 4,
                    px: 2,
                    borderRadius: 3,
                    backgroundColor: "#caf0f8",
                    color: "#023e8a",
                    textAlign: "center",
                    boxShadow: "0 6px 18px rgba(0, 119, 182, 0.2)",
                  }}
                  role="region"
                  aria-label={label}
                >
                  <Typography variant="h4" fontWeight={700}>
                    {value.toLocaleString()}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight={600} mt={1}>
                    {label}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Container maxWidth="lg" sx={{ mt: 6 }}>
          <Typography
            variant={isMobile ? "h6" : "h4"}
            sx={{ color: "#0077b6", mb: 3, textAlign: "center" }}
          >
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
                        src={getTeamLogo(team.id)}
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
        {bestPlayer && <Container maxWidth="lg" sx={{ mt: 6 }}>
          <Typography
            variant={isMobile ? "h6" : "h4"}
            sx={{ color: "#0077b6", mb: 3, textAlign: "center" }}
          >
            Hero Of The Tournament
          </Typography>
          <PlayerCard player={bestPlayer} />
        </Container>}
        {dialogOpen && (
          isLoading ? (
            <LoadingScreen />
          ) :
            <PlayerDetailsCard selectedTeam={selectedTeam} handleDialogClose={handleDialogClose} />
        )
        }
      </Container>
      <Box mt={6}>
        <Typography
          variant="h4"
          fontWeight="700"
          sx={{ color: "#0077b6", mb: 3, textAlign: "center" }}
        >
          What We Offer
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {features.map(({ title, desc, icon }, i) => (
            <Grid key={i} item xs={12} md={4}>
              <Card
                sx={{
                  height: "100%",
                  backgroundColor: "#ade8f4",
                  boxShadow: "0 4px 12px rgba(0, 119, 182, 0.2)",
                  borderRadius: 3,
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.05)",
                    boxShadow: "0 8px 20px rgba(0, 119, 182, 0.35)",
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    sx={{ mb: 1.5 }}
                    fontWeight={700}
                    color="#0077b6"
                    aria-label={`${title} icon`}
                  >
                    {icon} {title}
                  </Typography>
                  <Typography variant="body1" color="#03045e">
                    {desc}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box mt={6}>
        <Typography
          variant="h4"
          fontWeight="700"
          sx={{ color: "#0077b6", mb: 3, textAlign: "center" }}
        >
          Cricket Gear & Equipment
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {equipments.map(({ name, image }, i) => (
            <Grid key={i} item xs={12} sm={6} md={4}>
              <Card
                sx={{
                  maxWidth: 340,
                  mx: "auto",
                  boxShadow: "0 8px 20px rgba(0, 119, 182, 0.25)",
                  borderRadius: 4,
                  cursor: "pointer",
                  transition: "transform 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.04)",
                    boxShadow: "0 12px 30px rgba(0, 119, 182, 0.35)",
                  },
                }}
                onClick={() => handleTeamClick({ name, image })}
                aria-label={`View details for ${name}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleTeamClick({ name, image });
                }}
              >
                <CardMedia
                  component="img"
                  image={image}
                  alt={name}
                  loading="lazy"
                  sx={{
                    height: 200,
                    objectFit: "cover",
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                  }}
                />
                <CardContent>
                  <Typography
                    variant="h6"
                    textAlign="center"
                    fontWeight={700}
                    color="#0077b6"
                  >
                    {name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box
        component="footer"
        sx={{
          mt: 8,
          py: 4,
          px: 2,
          backgroundColor: "black",
          color: "#ffffff",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ color: "#FF8C00" }}>
          CricketTrack
        </Typography>
        <Typography variant="body2">
          © {new Date().getFullYear()} CricketTrack. All rights reserved.
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
          <Button color="inherit" size="small" sx={{ textTransform: "none" }}>
            About Us
          </Button>
          <Button color="inherit" size="small" sx={{ textTransform: "none" }}>
            Contact
          </Button>
          <Button color="inherit" size="small" sx={{ textTransform: "none" }}>
            Privacy Policy
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default HomePage;
