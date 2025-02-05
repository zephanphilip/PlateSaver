import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
  Typography,
  Divider,
} from "@mui/material";
import { useUser } from "@clerk/clerk-react";
import General from "../constants/General";

const Preferences = ({ isNavbarButton = false }) => {
  const { user, isLoaded } = useUser();
  const [open, setOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    username: "",
    dietary: "",
    cuisine: "",
    spiceLevel: "",
    cookingTime: "",
    culinarySkills: "",
    allergies: "",
  });
  const [existingPreferenceId, setExistingPreferenceId] = useState(null);

  useEffect(() => {
    if (isLoaded && user) {
      setPreferences((prev) => ({
        ...prev,
        username: user.id,
      }));
    }
  }, [isLoaded, user]);

  // Fetch existing preferences on user load
  useEffect(() => {
    if (isLoaded && user) {
      const fetchPreferences = async () => {
        try {
          const response = await fetch(
            `${General.API_BASE_URL}api/preferences/${user.id}`
          );
          if (response.ok) {
            const data = await response.json();
            if (data && data[0]) {
              setPreferences(data[0]);
              setExistingPreferenceId(data[0]._id); // Set the existingPreferenceId
            }
          }
        } catch (error) {
          console.error("Error fetching preferences:", error);
        }
      };
      fetchPreferences();
    }
  }, [isLoaded, user]);

  const handleOpen = () =>{ setOpen(true);
    // Explicitly fetch preferences when opening the dialog
  if (isLoaded && user) {
    const fetchPreferences = async () => {
      try {
        const response = await fetch(
          `${General.API_BASE_URL}api/preferences/${user.id}`
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data[0]) {
            setPreferences(data[0]); // Update preferences with fetched data
            setExistingPreferenceId(data[0]._id); // Update the existingPreferenceId
          }
        }
      } catch (error) {
        console.error("Error fetching preferences:", error);
      }
    };
    fetchPreferences();
  }
  };
  const handleClose = () => setOpen(false);

  const handleChange = (key) => (event) => {
    setPreferences((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSave = async () => {
    handleClose();

    // Remove the _id and __v fields before sending the request
    const { _id, __v, ...cleanPreferences } = preferences;

    // If the user has an existing preference, send a PUT request, else send a POST
    const isUpdate = !!existingPreferenceId;
    console.log( isUpdate );
    const url = isUpdate
      ? `${General.API_BASE_URL}api/preferences/${existingPreferenceId}` // PUT URL
      : `${General.API_BASE_URL}api/preferences`; // POST URL

    const method = isUpdate ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanPreferences),
      });

      if (response.ok) {
        console.log("Preferences saved successfully");
      } else {
        const errorData = await response.json();
        console.error("Failed to save preferences:", errorData);
      }
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  const NavbarButton = () => (
    <Button
      sx={{
        display: { xs: "none", sm: "inline-block" },
        fontWeight: "bold",
        color: "#FFE5E5",
        fontFamily: "Oswald, sans-serif",
      }}
      onClick={handleOpen}
    >
      Change Preferences
    </Button>
  );

  const renderSection = (label, options, key, direction = "row") => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        {label}
      </Typography>
      <RadioGroup
        row={direction === "row"}
        value={preferences[key]}
        onChange={handleChange(key)}
        sx={{
          display: "flex",
          flexDirection: direction,
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {options.map((option) => (
          <FormControlLabel
            key={option}
            value={option}
            control={<Radio color="primary" />}
            label={option}
          />
        ))}
      </RadioGroup>
      <Divider sx={{ mt: 2 }} />
    </Box>
  );

  return (
    <>
      {isNavbarButton ? (
        <NavbarButton />
      ) : (
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpen}
          sx={{ borderRadius: 2, px: 3, py: 1 }}
        >
          Open Preferences
        </Button>
      )}

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            width: "90%",
            maxWidth: "600px",
            borderRadius: 16,
            padding: 16,
          },
        }}
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          Set Your Preferences
        </DialogTitle>
        <DialogContent>
          <Box>
            {renderSection("Your Dietary", [
              "Vegan",
              "Keto",
              "Low-sugar",
              "Non-vegetarian",
              "Pescatarian",
            ], "dietary")}
            {renderSection(
              "Your Cuisine Preferences",
              ["Italian", "Mexican", "Indian", "Chinese", "Arabian"],
              "cuisine",
              "column"
            )}
            {renderSection(
              "Your Spice Level",
              ["Mild", "Medium", "Hot / Spicy"],
              "spiceLevel"
            )}
            {renderSection("Your Cooking Time", [
              "15-30 mins",
              "30 - 60 mins",
              "1 hour or more",
            ], "cookingTime")}
            {renderSection(
              "Your Culinary Skills",
              ["Beginner", "Intermediate", "Pro"],
              "culinarySkills"
            )}
            {renderSection("Food Allergies / Intolerances", [
              "Eggs",
              "Dairy",
              "Peanuts",
              "Soy",
            ], "allergies")}

            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ borderRadius: 8, px: 4 }}
                onClick={handleSave}
              >
                Save Preferences
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Preferences;
