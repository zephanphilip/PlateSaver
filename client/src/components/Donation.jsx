

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
import UserDonations from "./UserDonations";
import General from "../constants/General";

const Donation = () => {
  const { user, isLoaded } = useUser();
  const [refreshKey, setRefreshKey] = useState(0);

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
      const response = await fetch(`${General.API_BASE_URL}api/donate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.primaryEmailAddress.emailAddress,
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
      setRefreshKey(prevKey => prevKey + 1);
    } catch (err) {
      setError("Failed to submit donation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const textFieldStyle = {
    "& .MuiOutlinedInput-root": {
      backgroundColor: "white",
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#FF6B6B",
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "#FF6B6B",
      },
    },
    "& .MuiInputLabel-root": {
      color: "#FF6B6B",
      "&.Mui-focused": {
        color: "#FF6B6B",
      },
    },
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        px: 4,
        py: 6,
        bgcolor: "#FFE5E5",
      }}
    >
      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: "20px",
          padding: "40px",
          width: "100%",
          maxWidth: "800px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            mb: 4,
          }}
        >
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => window.history.back()}
            sx={{
              backgroundColor: "#FF6B6B",
              color: "white",
              "&:hover": {
                backgroundColor: "#ff5252",
              },
              borderRadius: "10px",
              padding: "8px 16px",
            }}
          >
            Back
          </Button>
          <Typography 
            variant="h4" 
            fontWeight="bold"
            sx={{
              color: "#FF6B6B",
              textAlign: "center",
            }}
          >
            Donate Leftover Food
          </Typography>
          <Box sx={{ width: "56px" }} />
        </Box>

        <TextField
          variant="outlined"
          label="Food Details"
          placeholder="E.g., 5 boxes of biryani"
          value={foodDetails}
          onChange={(e) => setFoodDetails(e.target.value)}
          fullWidth
          sx={{ ...textFieldStyle, mb: 3 }}
        />

        <TextField
          variant="outlined"
          label="Quantity"
          type="number"
          placeholder="E.g., 5 box"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          fullWidth
          sx={{ ...textFieldStyle, mb: 3 }}
        />

        <TextField
          variant="outlined"
          label="Expiry Date"
          type="date"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          fullWidth
          InputLabelProps={{ shrink: true }}
          sx={{ ...textFieldStyle, mb: 3 }}
        />

        <TextField
          variant="outlined"
          label="Allergy Information (Optional)"
          placeholder="E.g., Contains nuts"
          value={allergyInfo}
          onChange={(e) => setAllergyInfo(e.target.value)}
          fullWidth
          sx={{ ...textFieldStyle, mb: 3 }}
        />
        <Typography 
                    variant="body1" 
                    sx={{ 
                      color: "red",
                      mb: 1,
                      fontWeight: "bold",
                      textAlign: "center"
                    }}
                  >
                   Adoption & Donation Policy:
                   To maintain fairness and prevent misuse, once you accept a food adoption, you cannot cancel it. Similarly, once you submit a food donation, it cannot be revoked. This policy ensures that food commitments are honored, preventing disruptions that could negatively impact recipients, especially vulnerable groups such as old age homes. Since food is a vital resource, reliability is essential to avoid waste and ensure those in need receive the help they expect. Please commit responsibly before confirming an adoption or donation.
                  </Typography>
        <Button
          variant="contained"
          onClick={handleGetLocation}
          sx={{
            mb: 3,
            backgroundColor: "#FF6B6B",
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "#ff5252",
            },
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Enable Location Access"}
        </Button>

        {location && (
          <Typography 
            variant="body1" 
            sx={{ 
              mb: 2, 
              color: "#FF6B6B",
              textAlign: "center",
              backgroundColor: "#FFE5E5",
              padding: "10px",
              borderRadius: "8px"
            }}
          >
            Location detected: Latitude {location.latitude}, Longitude{" "}
            {location.longitude}
          </Typography>
          
        )}

        <Button
          variant="contained"
          onClick={handleDonate}
          sx={{
            backgroundColor: "#FF6B6B",
            width: "100%",
            padding: "12px",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "#ff5252",
            },
          }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Donate Food"}
        </Button>
      </Box>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
      >
        <Alert 
          onClose={() => setError("")} 
          severity="error" 
          sx={{ 
            width: "100%",
            "& .MuiAlert-icon": {
              color: "#FF6B6B"
            }
          }}
        >
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
          sx={{ 
            width: "100%",
            "& .MuiAlert-icon": {
              color: "#FF6B6B"
            }
          }}
        >
          Donation submitted successfully!
        </Alert>
      </Snackbar>

      <Box sx={{ mt: 4, width: "100%", maxWidth: "800px" }}>
        <UserDonations key={refreshKey}/>
      </Box>
    </Box>
  );
};

export default Donation;