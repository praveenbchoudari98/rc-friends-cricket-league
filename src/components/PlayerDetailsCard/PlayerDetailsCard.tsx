import React, { useState } from "react";
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography
} from "@mui/material";
import { TeamStats } from "../../types";
import PlayerSummaryStats from "./StatsCard";
import './FlipStyles.css'; // 👈 Include the CSS file
import { getTeamLogo } from "../../utils/matchUtils";

interface PlayerDetailsCardProps {
  selectedTeam: TeamStats;
  handleDialogClose: () => void;
}

const PlayerDetailsCard = ({ selectedTeam, handleDialogClose }: PlayerDetailsCardProps) => {
  const [statsTabOpen, setStatsTabOpen] = useState(false);

  return (
    <Dialog
      open
      onClose={handleDialogClose}
      aria-labelledby="team-dialog-title"
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle id="team-dialog-title">Player Details</DialogTitle>
      <DialogContent dividers>
        {selectedTeam.team && (
          <Box className="flip-container" sx={{ height: 500 }}>
            <Box className={`flipper ${statsTabOpen ? "flipped" : ""}`}>

              {/* Front - Image View */}
              <Box className="front">
                {selectedTeam.team.id && (
                  <Box
                    component="img"
                    src={selectedTeam.teamDetails.logo}
                    alt={selectedTeam.team.name}
                    sx={{
                      width: "100%",
                      height: "auto",
                      borderRadius: 2,
                      mb: 2,
                      boxShadow: 2,
                      objectFit: "cover",
                      maxHeight: 400,
                      border: "2px solid rgb(20, 21, 21)",
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },

                      "&:active": {
                        transform: "scale(0.95)",
                      },
                      "&:focus": {
                        outline: "none",
                      }
                    }}
                    loading="lazy"
                  />
                )}
                <Typography
                  variant="h6"
                  textAlign="center"
                  fontWeight={700}
                  color="#0077b6"
                >
                  {selectedTeam.team.name}
                </Typography>
                <Typography
                  variant="body2"
                  textAlign="center"
                  color="text.secondary"
                  sx={{ fontStyle: "italic", mt: 1 }}
                >
                  {selectedTeam.teamDetails.selfDescription ||
                    "Young and energetic aggressive batsman✨"}
                </Typography>
              </Box>

              {/* Back - Stats View */}
              <Box className="back">
                <PlayerSummaryStats playerStats={selectedTeam} />
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setStatsTabOpen(!statsTabOpen)} color="primary" autoFocus>
          {statsTabOpen ? "Back" : "View Stats"}
        </Button>
        <Button onClick={handleDialogClose} color="primary" autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PlayerDetailsCard;
