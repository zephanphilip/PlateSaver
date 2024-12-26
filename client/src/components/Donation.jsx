import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useUser } from "@clerk/clerk-react";

const Donation = () => {
    const { user, isLoaded } = useUser();
  const [location, setLocation] = useState(null);
  const [foodDetails, setFoodDetails] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [allergyInfo, setAllergyInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Function to get user location
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setLoading(false);
          setError("");
        },
        () => {
          setError("Unable to fetch location. Please enable location services.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  // Function to handle food donation submission
  const handleDonate = async () => {
    if (!foodDetails.trim()) {
      setError("Please provide details about the food.");
      return;
    }
    if (!quantity.trim()) {
      setError("Please specify the quantity.");
      return;
    }
    if (!expiryDate.trim()) {
      setError("Please provide the expiry date.");
      return;
    }
    if (!location) {
      setError("Please allow location access to proceed.");
      return;
    }

    setLoading(true);
    try {
      // Replace with actual API endpoint
      const response = await fetch("http://localhost:3001/api/donate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          foodDetails,
          quantity,
          expiryDate,
          allergyInfo,
          location,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit donation.");
      }

      setSuccess(true);
      setFoodDetails("");
      setQuantity("");
      setExpiryDate("");
      setAllergyInfo("");
      setLocation(null);
    } catch (err) {
      setError("Failed to submit donation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        px: 2,
        bgcolor: "#f7f7f7",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          mb: 3,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => window.history.back()}
          sx={{
            backgroundColor: "#2a1581",
            color: "white",
            "&:hover": {
              backgroundColor: "#43018f",
            },
          }}
        >
          Back
        </Button>
        <Typography variant="h4" fontWeight="bold">
          Donate Leftover Food
        </Typography>
        <Box sx={{ width: "56px" }} /> {/* Placeholder for alignment */}
      </Box>

      <TextField
        variant="outlined"
        label="Food Details"
        placeholder="E.g., 5 boxes of biryani"
        value={foodDetails}
        onChange={(e) => setFoodDetails(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
      />

      <TextField
        variant="outlined"
        label="Quantity"
        placeholder="E.g., 5"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
      />

      <TextField
        variant="outlined"
        label="Expiry Date"
        type="date"
        value={expiryDate}
        onChange={(e) => setExpiryDate(e.target.value)}
        fullWidth
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />

      <TextField
        variant="outlined"
        label="Allergy Information (Optional)"
        placeholder="E.g., Contains nuts"
        value={allergyInfo}
        onChange={(e) => setAllergyInfo(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
      />

      <Button
        variant="contained"
        onClick={handleGetLocation}
        sx={{
          mb: 3,
          backgroundColor: "#2a1581",
          "&:hover": {
            backgroundColor: "#43018f",
          },
        }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Enable Location Access"}
      </Button>

      {location && (
        <Typography variant="body1" sx={{ mb: 2, color: "green" }}>
          Location detected: Latitude {location.latitude}, Longitude{" "}
          {location.longitude}
        </Typography>
      )}

      <Button
        variant="contained"
        onClick={handleDonate}
        sx={{
          backgroundColor: "#ea098c",
          "&:hover": {
            backgroundColor: "#d0077b",
          },
        }}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} /> : "Donate Food"}
      </Button>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
      >
        <Alert onClose={() => setError("")} severity="error" sx={{ width: "100%" }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
      >
        <Alert
          onClose={() => setSuccess(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Donation submitted successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Donation;
