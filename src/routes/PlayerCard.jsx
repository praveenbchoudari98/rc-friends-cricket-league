import React from "react";
import {
  Card,
  CardMedia,
  Typography,
  Grid,
  Box,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function PlayerCard({ player }) {
  return (
    <Card
      sx={{
        maxWidth: 360,
        borderRadius: 4,
        boxShadow: 6,
        mx: "auto",
        mt: 4,
        px: 2,
        py: 2,
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#2E1A47",
      }}
    >
      <Accordion
        disableGutters
        elevation={0}
        sx={{
          background: "transparent",
          color: "inherit",
          boxShadow: "none",
          "&:before": { display: "none" },
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "#2E1A47" }} />}
          aria-controls="panel-content"
          id="panel-header"
          sx={{
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            p: 1,
            "& .MuiAccordionSummary-content": {
              margin: 0,
            },
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              backgroundColor: "rgba(255, 255, 255, 0.3)",
              borderRadius: 3,
              px: 2,
              py: 2,
              mb: 1,
            }}
          >
            <CardMedia
              component="img"
              image={player?.team.logo}
              alt={`${player?.team.name} Logo`}
              sx={{
                width: 100,
                height: 100,
                borderRadius: "50%",
                objectFit: "cover",
                border: "3px solid #E0D7F5",
                mb: 1,
                boxShadow: "0 0 12px rgba(132, 94, 247, 0.7)",
              }}
            />

            <Typography variant="h5" fontWeight={800} sx={{ color: "#FF8C00" }}>
              {player?.team.name}
            </Typography>

            <Typography
              variant="caption"
              sx={{ color: "#08b435", fontWeight: 500 }}
            >
              Click to view player stats
            </Typography>
          </Box>
        </AccordionSummary>

        <AccordionDetails sx={{ p: 0, mt: 2 }}>
          <Divider
            sx={{
              borderColor: "#B3A1D6",
              width: "80%",
              mx: "auto",
              mb: 2,
            }}
          />

          <Grid
            container
            spacing={2}
            sx={{ width: "100%", justifyContent: "center" }}
          >
            <StatItem label="Wins" value={player?.wins} />
            <StatItem label="Matches" value={player?.matches} />
            <StatItem label="Runs" value={player?.runsScored} />
            <StatItem label="Wickets" value={player?.wicketsTaken} />
            <StatItem label="Net Run Rate" value={player?.nrr} />
            <StatItem label="Points" value={player?.points} />
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Card>
  );
}

function StatItem({ label, value }) {
  return (
    <Grid item xs={6}>
      <Box
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.85)",
          p: 2,
          borderRadius: 3,
          textAlign: "center",
          boxShadow: "0 2px 8px rgba(46, 26, 71, 0.15)",
          userSelect: "none",
        }}
      >
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ color: "#e0280f", mb: 0.3 }}
        >
          {value ?? "-"}
        </Typography>
        <Typography
          variant="caption"
          sx={{ color: "#08b435", fontWeight: 600 }}
        >
          {label}
        </Typography>
      </Box>
    </Grid>
  );
}

export default PlayerCard;
