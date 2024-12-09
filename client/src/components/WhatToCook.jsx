import React from "react";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { motion } from "framer-motion";

const WhatToCook = () => {
  const [recipeIndex, setRecipeIndex] = React.useState(0);

  const recipes = [
    {
      title: "Texas-style Brisket",
      description: [
        "Step 1: Season and marinate the brisket overnight. In a large bowl or shallow dish, combine the Worcestershire sauce, chili powder, garlic, celery salt, pepper, and, if desired, liquid smoke.",
        "Step 2: Slow-cook the brisket. Transfer the beef to a 5- or 6-quart slow cooker. Add the broth and bay leaves. Cover and cook on low for six to eight hours, or until the meat is tender.",
        "Step 3: Make the barbecue sauce. To make the sauce, in a small saucepan, sauté the onion in oil until it’s tender. Add garlic and cook for one minute longer. Stir in the remaining ingredients, and heat them through.",
        "Step 4: Flavor the barbecue sauce with cooking juices. Remove the brisket from the slow cooker and discard the bay leaves. Place 1 cup of the cooking juices in a measuring cup and use a spoon to skim the fat.",
        "Step 5: Cook the brisket with the sauce. Return the brisket to the slow cooker and top with the sauce mixture. Cover and cook on high for 30 minutes to allow the flavors to blend.",
      ],
    },
    {
      title: "Classic Margherita Pizza",
      description: [
        "Step 1: Prepare the dough. Mix flour, water, yeast, and salt, knead, and let the dough rise for 1-2 hours.",
        "Step 2: Make the sauce. Blend fresh tomatoes, garlic, olive oil, and basil to create a smooth sauce.",
        "Step 3: Assemble the pizza. Roll out the dough, spread the sauce, and add fresh mozzarella cheese and basil leaves.",
        "Step 4: Bake. Bake in a preheated oven at 500°F for 7-10 minutes until the crust is golden and cheese is bubbling.",
      ],
    },
  ];
  

  const handlePreviousRecipe = () => {
    setRecipeIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : recipes.length - 1));
  };

  const handleNextRecipe = () => {
    setRecipeIndex((prevIndex) => (prevIndex < recipes.length - 1 ? prevIndex + 1 : 0));
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
          mb:25,
          justifyContent: "center",
          width: "100%",
        }}
      >
        <Button
          sx={{ color: "#2a1581", fontSize: "2rem" }}
          onClick={handlePreviousRecipe}
        >
          <ArrowLeftIcon fontSize="large" />
        </Button>
        <motion.div
        
          initial={{ boxShadow: "0 0 10px #fb6428" }}
          animate={{
            boxShadow: ["0 0 30px #fb6", "0 0 40px #ffc", "0 0 30px #fb6"],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "loop",
          }}
          style={{
            borderRadius: "16px",
            marginTop:35,
            width: "90%",
            maxWidth: "500px",
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
      sx={{ marginBottom: 2, fontSize: {lg:16,xl:18} }}  
    >
      {step}
    </Typography>
  ))}
        </motion.div>
        <Button
          sx={{ color: "#2a1581", fontSize: "2rem" }}
          onClick={handleNextRecipe}
        >
          <ArrowRightIcon fontSize="large" />
        </Button>
      </Box>
    </Box>
  );
};

export default WhatToCook;
