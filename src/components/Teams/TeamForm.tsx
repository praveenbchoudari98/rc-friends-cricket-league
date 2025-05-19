import React, { useState, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Avatar,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import type { Team } from "../../types";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { getTeamNameError } from "../../utils/validation";
import { PLAYER_AVATARS, getTeamAvatar } from "../Tournament/TeamCard";
import { generateUUID } from "../../utils/uuid";

// Environment check for production
const isProduction = process.env.NODE_ENV === "production";

interface TeamFormProps {
  onSubmit: (team: Team, sourceRect: DOMRect) => void;
  teams: Team[];
}

export const TeamForm = ({ onSubmit, teams }: TeamFormProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [teamName, setTeamName] = useState("");
  const [previewImage, setPreviewImage] = useState<string>(PLAYER_AVATARS[0]);
  const [hasCustomImage, setHasCustomImage] = useState(false);
  const [nameError, setNameError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    captain: "",
    coach: "",
    city: "",
    dob: "",
    teamSize: "",
    runsScored: "",
    totalWins: "",
    logo: PLAYER_AVATARS[0],
  });
  // Update preview avatar when team name changes
  const updatePreviewAvatar = (name: string) => {
    if (hasCustomImage && !isProduction) return;

    if (!name) {
      setPreviewImage(PLAYER_AVATARS[0]);
      return;
    }
    const tempId = name.toLowerCase().replace(/[^a-z0-9]/g, "");
    setPreviewImage(getTeamAvatar(tempId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = getTeamNameError(teams, formData.name);
    if (error) {
      setNameError(error);
      return;
    }

    setIsSubmitting(true);
    const formRect = formRef.current?.getBoundingClientRect() || new DOMRect();

    const team: Team = {
      id: generateUUID(),
      name: formData.name.trim(),
      captain: formData.captain,
      coach: formData.coach,
      city: formData.city,
      dob: formData.dob,
      teamSize: parseInt(formData.teamSize),
      runsScored: parseInt(formData.runsScored),
      totalWins: parseInt(formData.totalWins),
      logo: formData.logo,
      players: [], // Optional: adjust as needed
    };

    await new Promise((resolve) => setTimeout(resolve, 500));
    onSubmit(team, formRect);
    setIsSubmitting(false);

    // Reset form
    setFormData({
      name: "",
      captain: "",
      coach: "",
      city: "",
      dob: "",
      teamSize: "",
      runsScored: "",
      totalWins: "",
      logo: PLAYER_AVATARS[0],
    });
    setHasCustomImage(false);
    setNameError("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "name") {
      setNameError(getTeamNameError(teams, value));
      if (!hasCustomImage && !isProduction) {
        const tempId = value.toLowerCase().replace(/[^a-z0-9]/g, "");
        setFormData((prev) => ({ ...prev, logo: getTeamAvatar(tempId) }));
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isProduction) return;
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, logo: reader.result as string }));
        setHasCustomImage(true);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: { xs: "100%", sm: 500 },
        mx: "auto",
        mb: 4,
        borderRadius: { xs: 0, sm: 2 },
        background: theme.palette.background.paper,
        position: "relative",
        overflow: "visible",
        boxShadow: {
          xs: "none",
          sm: "0 8px 32px rgba(0, 0, 0, 0.08)",
        },
        border: { xs: "1px solid #e0e0e0", sm: "none" },
        transition: "all 0.3s ease-in-out",
        "&:hover": {
          boxShadow: {
            xs: "none",
            sm: "0 12px 48px rgba(0, 0, 0, 0.12)",
          },
        },
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: 4,
          background: "linear-gradient(90deg, #FF8C00 0%, #FF4B2B 100%)",
          borderRadius: { xs: 0, sm: "2px 2px 0 0" },
        }}
      />
      <Box
        component="form"
        onSubmit={handleSubmit}
        ref={formRef}
        sx={{
          p: { xs: 2, sm: 3 },
          display: "flex",
          flexDirection: "column",
          gap: 3,
          position: "relative",
          zIndex: 1,
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          ...(isSubmitting
            ? {
                opacity: 0,
                transform: "translateY(10px) scale(0.98)",
                filter: "blur(4px)",
              }
            : {}),
        }}
      >
        <Typography
          variant="h6"
          align="center"
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            mb: 1,
          }}
        >
          Add New Team
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 1,
            position: "relative",
          }}
        >
          <Avatar
            src={previewImage}
            sx={{
              width: { xs: 80, sm: 100 },
              height: { xs: 80, sm: 100 },
              border: "3px solid",
              borderColor: "primary.main",
              cursor: isProduction ? "default" : "pointer",
              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
              bgcolor: "background.paper",
              "&:hover": !isProduction
                ? {
                    transform: "scale(1.05)",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
                  }
                : {},
            }}
            onClick={() => !isProduction && fileInputRef.current?.click()}
          />
          {!isProduction && (
            <IconButton
              color="primary"
              aria-label="upload picture"
              component="span"
              onClick={() => fileInputRef.current?.click()}
              sx={{
                position: "absolute",
                bottom: -4,
                right: "35%",
                background: "linear-gradient(135deg, #FF8C00 0%, #FF4B2B 100%)",
                color: "white",
                boxShadow: "0 2px 12px rgba(255, 140, 0, 0.3)",
                width: { xs: 32, sm: 36 },
                height: { xs: 32, sm: 36 },
                "&:hover": {
                  background:
                    "linear-gradient(135deg, #FF4B2B 0%, #FF8C00 100%)",
                  transform: "scale(1.1) rotate(8deg)",
                },
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <PhotoCamera sx={{ fontSize: { xs: 16, sm: 18 } }} />
            </IconButton>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
            ref={fileInputRef}
            disabled={isProduction}
          />
        </Box>

        <TextField
          fullWidth
          label="Team Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={!!nameError}
          helperText={nameError}
          required
          margin="dense"
        />
        <TextField
          fullWidth
          label="Captain"
          name="captain"
          value={formData.captain}
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          fullWidth
          label="Coach"
          name="coach"
          value={formData.coach}
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          fullWidth
          label="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          fullWidth
          label="Date of Birth"
          name="dob"
          type="date"
          value={formData.dob}
          InputLabelProps={{ shrink: true }}
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          fullWidth
          label="Team Size"
          name="teamSize"
          type="number"
          value={formData.teamSize}
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          fullWidth
          label="Total Runs Scored"
          name="runsScored"
          type="number"
          value={formData.runsScored}
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          fullWidth
          label="Total Wins"
          name="totalWins"
          type="number"
          value={formData.totalWins}
          onChange={handleChange}
          margin="dense"
        />
        <TextField
          fullWidth
          label="Logo URL"
          name="logo"
          value={formData.logo}
          onChange={handleChange}
          margin="dense"
        />

        <Button
          type="submit"
          variant="contained"
          disabled={!formData.name || !!nameError || isSubmitting}
          sx={{
            py: { xs: 1, sm: 1.5 },
            background: "linear-gradient(135deg, #FF8C00 0%, #FF4B2B 100%)",
            borderRadius: 2,
            textTransform: "none",
            fontSize: { xs: "0.9rem", sm: "1rem" },
            fontWeight: 600,
            boxShadow: "0 4px 16px rgba(255, 140, 0, 0.3)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            "&:hover": {
              background: "linear-gradient(135deg, #FF4B2B 0%, #FF8C00 100%)",
              boxShadow: "0 8px 24px rgba(255, 140, 0, 0.4)",
              transform: "translateY(-2px)",
            },
            "&:active": {
              transform: "translateY(0)",
              boxShadow: "0 4px 16px rgba(255, 140, 0, 0.3)",
            },
            "&.Mui-disabled": {
              background: "#e0e0e0",
              boxShadow: "none",
            },
          }}
        >
          Add Team
        </Button>
      </Box>
    </Paper>
  );
};
