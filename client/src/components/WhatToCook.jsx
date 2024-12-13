import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";

const WhatToCook = () => {
  const { user, isLoaded } = useUser();
  const [recipes, setRecipes] = useState([]);
  const [recipeIndex, setRecipeIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch recipes from the backend
  useEffect(() => {
    const fetchRecipes = async () => {
      if (isLoaded && user) {
        try {
          const response = await fetch(`http://localhost:3001/api/ai/whattocook?userId=${user.id}`);
          
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Failed to fetch recipes: ${response.status} ${errorText}`);
          }
          
          const data = await response.json();
          
          // Validate the data structure
          if (!data || !data.recipe) {
            throw new Error("No recipe data received");
          }
          
          // Ensure recipe is in the expected format
          const recipeObj = {
            title: "Recipe",
            description: typeof data.recipe === 'string' 
              ? data.recipe.split('\n').filter(step => step.trim() !== '')
              : []
          };
          
          setRecipes([recipeObj]);
          setLoading(false);
        } catch (error) {
          console.error("Detailed error fetching recipes:", error);
          setLoading(false);
        }
      }
    };
  
    fetchRecipes();
  }, [user, isLoaded]);
  const handlePreviousRecipe = () => {
    setRecipeIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : recipes.length - 1));
  };

  const handleNextRecipe = () => {
    setRecipeIndex((prevIndex) => (prevIndex < recipes.length - 1 ? prevIndex + 1 : 0));
  };

  if (loading) {
    return (
      <Typography variant="h5" color="textSecondary">
        Loading recipes...
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        height: "100vh",
        px: 2,
        py: 2,
        bgcolor: "#fbbc30",
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
        <Typography variant="h4" fontWeight="bold" sx={{ textAlign: "center", color: "white" }}>
          Hmmm.. WHAT TO COOK?
        </Typography>
        <Box sx={{ width: "56px" }} /> {/* Placeholder for spacing */}
      </Box>

      {/* Middle Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Button sx={{ color: "#2a1581", fontSize: "2rem" }} onClick={handlePreviousRecipe}>
          <ArrowLeftIcon fontSize="large" />
        </Button>
        {recipes.length > 0 ? (
          <Box
           
            style={{
              borderRadius: "16px",
              width: "90%",
              maxWidth: "1500px",
              minHeight: "450px",
              padding: "16px",
              backgroundColor: "#fb6428",
              textAlign: "center",
            }}
          >
            <Typography variant="h5" color="white" gutterBottom>
              {recipes[recipeIndex].title}
            </Typography>
            {recipes[recipeIndex].description.map((step, index) => (
              <Typography
                key={index}
                variant="body1"
                color="white"
                sx={{ marginBottom: 2, fontSize: { lg: 16, xl: 18 } }}
              >
                {step}
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography variant="h6" color="textSecondary">
            No recipes available.
          </Typography>
        )}
        <Button sx={{ color: "#2a1581", fontSize: "2rem" }} onClick={handleNextRecipe}>
          <ArrowRightIcon fontSize="large" />
        </Button>
      </Box>
    </Box>
  );
};

export default WhatToCook;




