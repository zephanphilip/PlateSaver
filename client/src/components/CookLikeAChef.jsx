import React from "react";
import { Box, Button, TextField, Typography, Card } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion } from "framer-motion";

const CookLikeAChef = () => {
  const [prompt, setPrompt] = React.useState("");
  const [result, setResult] = React.useState("Generate Your Magic Recipie!");

  const handleGenerateRecipe = () => {
    if (prompt.trim()) {
      setResult(`Cooking recipe generated for: "${prompt}"`); // Replace with API call logic if needed
    } else {
      setResult("Please enter a valid prompt.");
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
          sx={{backgroundColor: '#2a1581',
            '&:hover': {
              backgroundColor: '#43018f',
            }, fontWeight: "bold" ,color: "white",}}
          onClick={() => window.history.back()}
        >
          Back
        </Button>
        <Typography variant="h2" fontWeight="bold" sx={{ textAlign: "center",color:"WHITE" }}>
          COOK LIKE A CHEF
        </Typography>
        <Box sx={{ width: "56px" }} /> {/* Placeholder for spacing */}
      </Box>

   
      {/* Middle Section */}
      <motion.div
        initial={{ boxShadow: "0 0 10px #fe98ec" }}
        animate={{
          boxShadow: [
            "0 0 30px #fff",
            "0 0 40px #fff",
            "0 0 30px #fff",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: "loop",
        }}
        style={{
          borderRadius: "16px",
          width: "90%",
          maxWidth: "500px",
          minHeight: "150px",
          margin: "auto",
          padding: "16px",
          backgroundColor: "#ea098c",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="body1" color="white">
          {result}
        </Typography>
      </motion.div>


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
      color: "rgba(255, 255, 255, 0.8)", // Placeholder color
    },
    "& .MuiInputBase-input": {
      color: "white", // Text color
    }, "& .MuiOutlinedInput-root": {
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "white", // Hover outline color
      },
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: "white", // Focused outline color
      },
    },
          }}
        />
        <Button
          variant="contained"
          
          onClick={handleGenerateRecipe}
          sx={{ borderRadius: 8, px: 4,mb:4 ,backgroundColor: '#2a1581',
            '&:hover': {
              backgroundColor: '#43018f',
            },}}
        >
          Generate Recipe
        </Button>
      </Box>
    </Box>
  );
};

export default CookLikeAChef;
