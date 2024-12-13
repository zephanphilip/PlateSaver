import React from "react";
import { Box, Button, TextField, Typography, CircularProgress } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion } from "framer-motion";

const CookLikeAChef = () => {
  const [prompt, setPrompt] = React.useState("");
  const [result, setResult] = React.useState(["Generate your Magic recipe!"]);
  const [loading, setLoading] = React.useState(false);

  const parseRecipe = (text) => {
    // Split recipe into steps using regex that captures the number and step together
  const steps = text.match(/(\d+\.\s[^\n]+)/g);
  
  // Return the steps as an array, with each step on a new line
  return steps || [];
  };

  const handleGenerateRecipe = async () => {
    if (prompt.trim()) {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:3001/api/ai/cooklikeachef", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch recipe");
        }

        const data = await response.json();
        setResult(parseRecipe(data.recipe || "No recipe found."));
      } catch (error) {
        console.error("Error generating recipe:", error);
        setResult(["Failed to generate the recipe. Try again later."]);
      } finally {
        setLoading(false);
      }
    } else {
      setResult(["Please enter a valid prompt."]);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100vh",
        px: 2,
        py: 0,
        bgcolor: "#fe98ec",
      }}
    >
      {/* Top Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Button
          startIcon={<ArrowBackIcon sx={{ color: "white" }} />}
          sx={{
            backgroundColor: "#2a1581",
            "&:hover": {
              backgroundColor: "#43018f",
            },
            fontWeight: "bold",
            color: "white",
          }}
          onClick={() => window.history.back()}
        >
          Back
        </Button>
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{ textAlign: "center", color: "white" }}
        >
          COOK LIKE A CHEF
        </Typography>
        <Box sx={{ width: "56px" }} /> {/* Placeholder for spacing */}
      </Box>

      {/* Middle Section */}
      
        {loading ? (
          <CircularProgress color="inherit" />
        ) : (
          <Box
        initial={{ boxShadow: "0 0 10px #fe98ec" }}
        animate={{
          boxShadow: ["0 0 30px #fff", "0 0 40px #fff", "0 0 30px #fff"],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
        }}
        sx={{
          borderRadius: 2,
          width: "70%",
          maxWidth: "1200px",
          minHeight: "150px",
          margin: "auto",
          padding: 2,
          backgroundColor: "#ea098c",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "left",
        }}
      >
          {result.map((line, index) => (
            <Typography
              key={index}
              variant={line.match(/^\d+\.\s/) ? "body1" : "h6"} // Different style for steps and sections
              color="white"
              sx={{ marginBottom: 1 ,textAlign: "center" }}
            >
              {line}
            </Typography>
          ))}
          </Box>
        )}
      

      {/* Bottom Prompt Section */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      >
        <TextField
          variant="outlined"
          placeholder="Spicy Biriyani..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          sx={{
            width: "90%",
            maxWidth: "500px",
            mb: 2,
            bgcolor: "#ea098c",
            borderRadius: 2,
            "& .MuiInputBase-input::placeholder": {
              color: "rgba(255, 255, 255, 0.8)",
            },
            "& .MuiInputBase-input": {
              color: "white",
            },
            "& .MuiOutlinedInput-root": {
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleGenerateRecipe}
          sx={{
            borderRadius: 8,
            px: 4,
            mb: 4,
            backgroundColor: "#2a1581",
            "&:hover": {
              backgroundColor: "#43018f",
            },
          }}
        >
          Generate Recipe
        </Button>
      </Box>
    </Box>
  );
};

export default CookLikeAChef;
