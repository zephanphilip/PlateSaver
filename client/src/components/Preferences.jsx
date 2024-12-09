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
import { useUser } from '@clerk/clerk-react';

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
  useEffect(() => {
    if (isLoaded && user) {
      setPreferences((prev) => ({
        ...prev,
        username: user.id,
      }));
    }
  }, [isLoaded, user]);

  // Log preferences when they change
  useEffect(() => {
    console.log(preferences);
  }, [preferences]);

  console.log(preferences); // Check the updated state

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (key) => (event) => {
    setPreferences((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const handleSave = async () => {
    // Close the dialog
    handleClose();

    // Send data to the backend
    try {
      const response = await fetch("http://localhost:3001/api/preferences/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });

      if (response.ok) {
        console.log("Preferences saved successfully");
      } else {
        console.error("Failed to save preferences");
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
        color: "#43018f",
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
            {renderSection("Your Spice Level", ["Mild", "Medium", "Hot / Spicy"], "spiceLevel")}
            {renderSection("Your Cooking Time", [
              "Under 15 mins",
              "15-30 mins",
              "30 - 60 mins",
              "1 hour or more",
            ], "cookingTime")}
            {renderSection("Your Culinary Skills", ["Beginner", "Intermediate", "Pro"], "culinarySkills")}
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


// import React, { useState } from "react";
// import {
//   Box,
//   Button,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   FormControlLabel,
//   Radio,
//   RadioGroup,
//   Typography,
//   Divider,
// } from "@mui/material";

// const Preferences = ({ isNavbarButton = false }) => {
//   const [open, setOpen] = useState(false);

//   const handleOpen = () => setOpen(true);
//   const handleClose = () => setOpen(false);

//   const NavbarButton = () => (
//     <Button
//       sx={{
//         display: { xs: "none", sm: "inline-block" },
//         fontWeight: "bold",
//         color: "#43018f",
//         fontFamily: "Oswald, sans-serif",
//       }}
//       onClick={handleOpen}
//     >
//       Change Preferences
//     </Button>
//   );

//   const renderSection = (label, options, direction = "row") => (
//     <Box sx={{ mb: 3 }}>
//       <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
//         {label}
//       </Typography>
//       <RadioGroup
//         row={direction === "row"}
//         sx={{
//           display: "flex",
//           flexDirection: direction,
//           gap: 2,
//           flexWrap: "wrap",
//         }}
//       >
//         {options.map((option) => (
//           <FormControlLabel
//             key={option}
//             value={option}
//             control={<Radio color="primary" />}
//             label={option}
//           />
//         ))}
//       </RadioGroup>
//       <Divider sx={{ mt: 2 }} />
//     </Box>
//   );

//   return (
//     <>
//       {isNavbarButton ? (
//         <NavbarButton />
//       ) : (
//         <Button
//           variant="contained"
//           color="primary"
//           onClick={handleOpen}
//           sx={{ borderRadius: 2, px: 3, py: 1 }}
//         >
//           Open Preferences
//         </Button>
//       )}

//       <Dialog
//         open={open}
//         onClose={handleClose}
//         PaperProps={{
//           style: {
//             width: "90%",
//             maxWidth: "600px",
//             borderRadius: 16,
//             padding: 16,
//           },
//         }}
//       >
//         <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
//           Set Your Preferences
//         </DialogTitle>
//         <DialogContent>
//           <Box>
//             {renderSection("Your Dietary", [
//               "Vegan",
//               "Keto",
//               "Low-sugar",
//               "Non-vegetarian",
//               "Pescatarian",
//             ])}
//             {renderSection("Your Cuisine Preferences", [
//               "Italian",
//               "Mexican",
//               "Indian",
//               "Chinese",
//               "Arabian",
//             ], "column")}
//             {renderSection("Your Spice Level", [
//               "Mild",
//               "Medium",
//               "Hot / Spicy",
//             ])}
//             {renderSection("Your Cooking Time", [
//               "Under 15 mins",
//               "15-30 mins",
//               "30 - 60 mins",
//               "1 hour or more",
//             ])}
//             {renderSection("Your Culinary Skills", [
//               "Beginner",
//               "Intermediate",
//               "Pro",
//             ])}
//             {renderSection("Food Allergies / Intolerances", [
//               "Eggs",
//               "Dairy",
//               "Peanuts",
//               "Soy",
//             ])}

//             <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
//               <Button
//                 variant="contained"
//                 color="primary"
//                 sx={{ borderRadius: 8, px: 4 }}
//                 onClick={handleClose}
//               >
//                 Save Preferences
//               </Button>
//             </Box>
//           </Box>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default Preferences;



