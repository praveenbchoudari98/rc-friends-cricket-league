import React from "react";
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
} from "@mui/material";
import Slider from "react-slick";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import kit from "../assets/images/Kit.webp";
import Ball from "../assets/images/ball.jpg";
import Bat from '../assets/images/bat.webp'
import MIRC24 from "../assets/images/MIRC24.webp";
import RC24 from "../assets/images/RC24.jpg";
import RCControl from "../assets/images/RCControls.webp";

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

const stats = [
  { label: "Matches Covered", value: 342 },
  { label: "Runs Recorded", value: "58,200+" },
  { label: "Wickets Tracked", value: 1140 },
];

const floatingItems = [
  { icon: "🏏", label: "Bat", size: 60, initialX: 2, initialY: 20, delay: 0 },
  { icon: "🥎", label: "Ball", size: 55, initialX: 90, initialY: 35, delay: 1 },
  { icon: "🧤", label: "Gloves", size: 50, initialX: 45, initialY: 60, delay: 2 },
  { icon: "🎽", label: "Jersey", size: 65, initialX: 80, initialY: 80, delay: 1.5 },
  { icon: "🥎", label: "Ball", size: 55, initialX: 1, initialY: 40, delay: 1 },
  
];

const floatAnimation = {
  y: ["0%", "20%", "0%", "-15%", "0%"],
  x: ["0%", "15%", "0%", "-10%", "0%"],
  rotate: [0, 15, -15, 20, 0],
};

const rc24TextAnimation = {
  y: ["0%", "10%", "0%", "-10%", "0%"],
  opacity: [1, 0.8, 1, 0.8, 1],
  scale: [1, 1.1, 1, 1.1, 1],
  textShadow: [
    "0 0 8px #ff4500, 0 0 20px #ff6347",
    "0 0 12px #ff4500, 0 0 28px #ff6347",
    "0 0 8px #ff4500, 0 0 20px #ff6347",
    "0 0 12px #ff4500, 0 0 28px #ff6347",
    "0 0 8px #ff4500, 0 0 20px #ff6347",
  ],
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4500,
  };

  return (
    <>
      {floatingItems.map(({ icon, label, size, initialX, initialY, delay }, i) => (
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
      ))}

      <Container
        maxWidth="lg"
        sx={{ mt: { xs: 2, md: 4 }, px: { xs: 1, md: 3 }, position: "relative", zIndex: 1 }}
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
          sx={{ mt: 5, mb: 2 }}
        >
          Welcome to CricketTrack – The Game, Live.
        </Typography>
        <Typography
          align="center"
          color="text.secondary"
          sx={{ mb: 4, px: isMobile ? 2 : 0 }}
        >
          A unified platform for live cricket scores, global coverage, analytics, and cricket passion.
        </Typography>

        <Paper
          elevation={3}
          sx={{
            mt: { xs: 3, md: 5 },
            p: { xs: 2, md: 4 },
            borderRadius: 3,
            backgroundImage: "url('/images/cricket-bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: "#fff",
          }}
        >
          <Typography variant={isMobile ? "h6" : "h5"}>🏏 Live Match: PC vs SK</Typography>
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
    </>
  );
};

export default HomePage;
