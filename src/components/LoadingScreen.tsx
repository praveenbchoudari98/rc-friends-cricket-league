import React from "react";
import { Box, Typography, Container } from "@mui/material";

export const LoadingScreen: React.FC = () => {
  return (
    <Container maxWidth={false} disableGutters sx={{ height: "100vh" }}>
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(6px)",
          zIndex: 9999,
        }}
      >
        {/* Enhanced RC24 Logo */}
        <Box
          sx={{
            fontSize: "4.5rem",
            fontWeight: 700,
            background: "linear-gradient(90deg, #f9d423, #ff4e50)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "2px 2px 8px rgba(0,0,0,0.4)",
            animation: "bounce 1.6s infinite ease-in-out, pulse 2s infinite",
            mb: 1,
            textAlign: "center",
          }}
        >
          RC24...⛹️‍♂️⛹️‍♂️
        </Box>

        <Box
          sx={{
            fontSize: "2rem",
            animation: "spinBall 1.2s linear infinite",
            mb: 1,
          }}
        >
          🏏
        </Box>

        <Box
          sx={{
            fontSize: "1.5rem",
            animation: "pulseDots 1.5s ease-in-out infinite",
            mb: 2,
          }}
        >
          🟡 🔵 🟢
        </Box>

        <Typography
          variant="h6"
          sx={{
            color: "white",
            fontWeight: 500,
            letterSpacing: "0.5px",
            textShadow: "1px 1px 4px rgba(0,0,0,0.6)",
            animation: "fadeIn 1.5s ease-in-out infinite alternate",
          }}
        >
          Loading Tournament...
        </Typography>
      </Box>

      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }

          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }

          @keyframes fadeIn {
            0% { opacity: 0.6; }
            100% { opacity: 1; }
          }

          @keyframes spinBall {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @keyframes pulseDots {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.15); }
          }
        `}
      </style>
    </Container>
  );
};
