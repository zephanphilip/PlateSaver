import React from "react";
import { Box, Button, TextField, Typography, Card } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { motion } from "framer-motion";

const SmartMealPlanner = () => {

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
        <Typography variant="h3" fontWeight="bold" sx={{ textAlign: "center",color:"WHITE" }}>
          Smart Meal Planner
        </Typography>
        <Box sx={{ width: "56px" }} /> {/* Placeholder for spacing */}
      </Box>

   
      {/* Middle Section */}
      <Button
          variant="contained"
          size="large"
          
          sx={{ borderRadius: 8, px: 4,mb:4 ,backgroundColor: '#2a1581',
            '&:hover': {
              backgroundColor: '#43018f',
            },}}
        >
          Plan your Meal for this week !
        </Button>
        <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
        }}
      ></Box>

      
    </Box>
  );
};

export default SmartMealPlanner
