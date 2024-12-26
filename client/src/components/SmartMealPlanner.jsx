import React, { useState } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Container 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion } from 'framer-motion';
import { useUser } from "@clerk/clerk-react";

const SmartMealPlanner = () => {
  const { user, isLoaded } = useUser();
  const [mealPlan, setMealPlan] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMealPlan = async () => {
    setLoading(true);
    if (isLoaded && user) {
      try {
        const response = await fetch(`http://localhost:3001/api/ai/mealplan?userId=${user.id}`);
        const data = await response.json();
        
        // Check if mealPlan is an array before setting state
        if (Array.isArray(data.mealPlan)) {
          setMealPlan(data.mealPlan);
        } else {
          console.error('Received meal plan is not an array:', data.mealPlan);
          setMealPlan([]); // Set an empty array if the response is not valid
        }
      } catch (error) {
        console.error('Error fetching meal plan:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '100vh',
        px: 2,
        py: 0,
        bgcolor: '#fe98ec',
      }}
    >
      {/* Top Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Button
          startIcon={<ArrowBackIcon sx={{ color: 'white' }} />}
          sx={{
            backgroundColor: '#2a1581',
            '&:hover': {
              backgroundColor: '#43018f',
            },
            fontWeight: 'bold',
            color: 'white',
          }}
          onClick={() => window.history.back()}
        >
          Back
        </Button>
        <Typography variant="h3" fontWeight="bold" sx={{ textAlign: 'center', color: 'WHITE' }}>
          Smart Meal Planner
        </Typography>
        <Box sx={{ width: '56px' }} /> {/* Placeholder for spacing */}
      </Box>

      {/* Middle Section */}
      <Button
        variant="contained"
        size="large"
        onClick={fetchMealPlan}
        disabled={loading}
        sx={{
          borderRadius: 8,
          px: 4,
          mb: 4,
          backgroundColor: '#2a1581',
          '&:hover': {
            backgroundColor: '#43018f',
          },
        }}
      >
        {loading ? 'Generating...' : 'Plan your Meal for this week!'}
      </Button>

      {/* Meal Plan Display */}
      {mealPlan.length > 0 ? (
  <Container maxWidth="md">
    <Grid container spacing={2}>
      {mealPlan.map((dayPlan, index) => (
        <Grid item xs={12} key={index}>
          <Card
            component={motion.div}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <CardContent>
              <Typography variant="h5" gutterBottom>
                {dayPlan.day}
              </Typography>
              {Object.entries(dayPlan.meals).map(([mealType, meal], mealIndex) => (
                <Typography key={mealIndex} variant="body1">
                  {mealType.charAt(0).toUpperCase() + mealType.slice(1)}: {meal || 'No meal planned'}
                </Typography>
              ))}
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </Container>
) : (
  <Typography variant="body1" sx={{ textAlign: 'center' }}>
    No meal plan available for this week.
  </Typography>
)}

    </Box>
  );
};


export default SmartMealPlanner;
