import React, { useEffect, useState } from "react";
import { Box, Button, Typography, CircularProgress, IconButton, Snackbar } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { format } from 'date-fns';

const InstantTimelyRecipie = () => {
  const getCurrentTime = () => format(new Date(), 'HH:mm');
  
  const mealTime = () => {
    const time = getCurrentTime();
    const [hours, minutes] = time.split(':').map(Number);
    const currentMinutes = hours * 60 + minutes;

    if (currentMinutes >= 300 && currentMinutes < 720) return 'Breakfast';
    if (currentMinutes >= 720 && currentMinutes < 900) return 'Lunch';
    if (currentMinutes >= 900 && currentMinutes < 1140) return 'Snacks';
    if (currentMinutes >= 1140 && currentMinutes < 1440) return 'Dinner';
    return 'Late Night Snacks';
  };

  const { user, isLoaded } = useUser();
  const [recipes, setRecipes] = useState([]);
  const [recipeIndex, setRecipeIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentMealTime, setCurrentMealTime] = useState(mealTime());
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const parseRecipe = (text) => {
    const sections = text.split(/\n(?=[A-Za-z]+:)/).map(section => {
      const lines = section.split('\n').map(line => line.trim()).filter(line => line);
      return lines;
    }).flat();

    return {
      title: sections[0] || "Recipe",
      description: sections.slice(1) || []
    };
  };

  const fetchNewRecipe = async () => {
    if (isLoaded && user) {
      try {
        const response = await fetch(
          `http://localhost:3001/api/ai/whattocook?userId=${user.id}&mealTime=${currentMealTime}`
        );
        
        if (!response.ok) {
          throw new Error(`Failed to fetch recipes: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (!data || !data.recipe) {
          throw new Error("No recipe data received");
        }
        
        const parsedRecipe = parseRecipe(data.recipe);
        return parsedRecipe;
      } catch (error) {
        console.error("Error fetching recipe:", error);
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    const initialFetch = async () => {
      const recipe = await fetchNewRecipe();
      if (recipe) {
        setRecipes([recipe]);
      }
      setLoading(false);
    };
  
    initialFetch();
  }, [user, isLoaded]);

  const handlePreviousRecipe = () => {
    setRecipeIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : recipes.length - 1));
  };

  const handleNextRecipe = async () => {
    setLoading(true);
    const newRecipe = await fetchNewRecipe();
    if (newRecipe) {
      setRecipes(prev => [...prev, newRecipe]);
      setRecipeIndex(prev => prev + 1);
    }
    setLoading(false);
  };

  const handleCopy = () => {
    if (recipes[recipeIndex]) {
      const recipeText = [
        recipes[recipeIndex].title,
        ...recipes[recipeIndex].description
      ].join('\n');
      
      navigator.clipboard.writeText(recipeText);
      setSnackbarOpen(true);
    }
  };

  const getLineStyle = (line) => {
    if (line.endsWith(':')) {
      return {
        fontWeight: 'bold',
        fontSize: { xs: '1.2rem', md: '1.4rem' },
        mt: 2,
        mb: 1,
        color: '#FFE5E5'
      };
    } else if (line.match(/^\d+\./)) {
      return {
        ml: { xs: 1, md: 2 },
        mb: 1,
        fontSize: { xs: '1rem', md: '1.1rem' }
      };
    } else if (line.startsWith(' ')) {
      return {
        ml: { xs: 2, md: 3 },
        mb: 0.5,
        fontSize: { xs: '0.9rem', md: '1rem' }
      };
    }
    return {
      mb: 0.5,
      fontSize: { xs: '0.9rem', md: '1rem' }
    };
  };

  if (loading && recipes.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: "#FFE5E5"
        }}
      >
        <CircularProgress sx={{ color: "#FF6B6B" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        px: { xs: 1, sm: 2 },
        py: { xs: 1, sm: 2 },
        bgcolor: "#FFE5E5",
      }}
    >
      {/* Top Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
          mb: 2
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          sx={{
            backgroundColor: "#FF6B6B",
            "&:hover": {
              backgroundColor: "#ff5252",
            },
            fontWeight: "bold",
            color: "white",
            px: { xs: 1, sm: 2 },
            py: 1,
          }}
          onClick={() => window.history.back()}
        >
          Back
        </Button>
        <Typography 
          variant="h4" 
          fontWeight="bold" 
          sx={{ 
            textAlign: "center", 
            color: "#FF6B6B",
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' }
          }}
        >
         Your {mealTime()} is here!
        </Typography>
        <Box sx={{ width: { xs: "40px", sm: "56px" } }} />
      </Box>

      {/* Middle Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          flex: 1,
          gap: { xs: 1, sm: 2 }
        }}
      >
        <Button 
          sx={{ 
            color: "#FF6B6B",
            minWidth: { xs: '40px', sm: '56px' }
          }} 
          onClick={handlePreviousRecipe}
          disabled={loading || recipes.length <= 1}
        >
          <ArrowLeftIcon fontSize={window.innerWidth < 600 ? "medium" : "large"} />
        </Button>
        
        {recipes.length > 0 ? (
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            sx={{
              borderRadius: "16px",
              width: "100%",
              maxWidth: "800px",
              minHeight: { xs: '300px', sm: '400px', md: '450px' },
              p: { xs: 2, sm: 3 },
              backgroundColor: "#FF6B6B",
              boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
              overflowY: "auto",
              maxHeight: { xs: '60vh', sm: '70vh' },
              position: "relative"
            }}
          >
            {loading ? (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.7)"
                }}
              >
                <CircularProgress sx={{ color: "#FF6B6B" }} />
              </Box>
            ) : (
              <>
                <IconButton
                  onClick={handleCopy}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 0.1)"
                    }
                  }}
                >
                  <ContentCopyIcon />
                </IconButton>
                <Typography 
                  variant="h5" 
                  sx={{
                    color: "white",
                    mb: 3,
                    fontSize: { xs: '1.2rem', sm: '1.5rem', md: '1.8rem' },
                    fontWeight: "bold"
                  }}
                >
                  {recipes[recipeIndex].title}
                </Typography>
                {recipes[recipeIndex].description.map((line, index) => (
                  <Typography
                    key={index}
                    sx={{
                      color: "white",
                      textAlign: "left",
                      ...getLineStyle(line)
                    }}
                  >
                    {line}
                  </Typography>
                ))}
              </>
            )}
          </Box>
        ) : (
          <Typography variant="h6" sx={{ color: "#FF6B6B" }}>
             Add items to your pantry.
          </Typography>
        )}
        
        <Button 
          sx={{ 
            color: "#FF6B6B",
            minWidth: { xs: '40px', sm: '56px' }
          }} 
          onClick={handleNextRecipe}
          disabled={loading}
        >
          <ArrowRightIcon fontSize={window.innerWidth < 600 ? "medium" : "large"} />
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Recipe copied to clipboard!"
        ContentProps={{
          sx: {
            backgroundColor: "#FF6B6B"
          }
        }}
      />
    </Box>
  );
};

export default InstantTimelyRecipie
