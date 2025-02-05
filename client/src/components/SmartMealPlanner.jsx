

import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  Grid,
  Container,
  CircularProgress,
  IconButton,
  Snackbar
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import KitchenIcon from '@mui/icons-material/Kitchen';
import { motion } from 'framer-motion';
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';
import General from '../constants/General';

const SmartMealPlanner = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const [mealPlan, setMealPlan] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: ''
  });

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const navigateToPantry = () => {
    navigate('/pantrypro');
  };

  const copyToClipboard = async (text, message) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbar({
        open: true,
        message: message
      });
    } catch (err) {
      console.error('Failed to copy:', err);
      setSnackbar({
        open: true,
        message: 'Failed to copy to clipboard'
      });
    }
  };

  const formatDayPlan = (dayPlan) => {
    let formattedText = `${dayPlan.day}\n`;
    Object.entries(dayPlan.meals).forEach(([mealType, meal]) => {
      formattedText += `${mealType.charAt(0).toUpperCase() + mealType.slice(1)}: ${meal || 'No meal planned'}\n`;
    });
    return formattedText;
  };

  const formatFullMealPlan = () => {
    return mealPlan.map(dayPlan => formatDayPlan(dayPlan)).join('\n\n');
  };

  const copyFullMealPlan = () => {
    const text = formatFullMealPlan();
    copyToClipboard(text, 'Full meal plan copied to clipboard!');
  };

  const copyDayPlan = (dayPlan) => {
    const text = formatDayPlan(dayPlan);
    copyToClipboard(text, `${dayPlan.day}'s meal plan copied to clipboard!`);
  };

  const fetchMealPlan = async () => {
    setLoading(true);
    if (isLoaded && user) {
      try {
        const response = await fetch(`${General.API_BASE_URL}api/ai/mealplan?userId=${user.id}`);
        const data = await response.json();

        if (Array.isArray(data.mealPlan)) {
          setMealPlan(data.mealPlan);
        } else {
          console.error('Received meal plan is not an array:', data.mealPlan);
          setMealPlan([]);
        }
      } catch (error) {
        console.error('Error fetching meal plan:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getMealTypeIcon = (mealType) => {
    switch (mealType.toLowerCase()) {
      case 'breakfast':
        return '🌅';
      case 'lunch':
        return '🌞';
      case 'dinner':
        return '🌙';
      case 'snacks':
        return '🍎';
      default:
        return '🍽️';
    }
  };

  const EmptyState = () => (
    <Box
      component={motion.div}
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      sx={{
        textAlign: 'center',
        color: '#FF6B6B',
        p: 4,
        backgroundColor: 'white',
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      }}
    >
      <Typography variant="h6">
        No meal plan available for this week.
      </Typography>
      <Typography variant="body1" sx={{ mt: 1, color: '#666', mb: 3 }}>
        Add items to pantry before generating your personalized meal plan!
      </Typography>
      <Button
        variant="contained"
        startIcon={<KitchenIcon />}
        onClick={navigateToPantry}
        sx={{
          backgroundColor: '#FF6B6B',
          '&:hover': {
            backgroundColor: '#ff5252',
          },
          color: 'white',
          borderRadius: 8,
          px: 4,
          py: 1.5,
          fontWeight: 'bold',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        }}
      >
        Go to Pantry
      </Button>
    </Box>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        px: { xs: 1, sm: 2, md: 3 },
        py: { xs: 2, sm: 3 },
        bgcolor: '#FFE5E5',
      }}
    >
      {/* Top Section */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          mb: 4
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          sx={{
            backgroundColor: '#FF6B6B',
            '&:hover': {
              backgroundColor: '#ff5252',
            },
            fontWeight: 'bold',
            color: 'white',
            px: { xs: 1, sm: 2 },
            py: 1,
          }}
          onClick={() => window.history.back()}
        >
          Back
        </Button>
        <Typography 
          variant="h3" 
          fontWeight="bold" 
          sx={{ 
            textAlign: 'center', 
            color: '#FF6B6B',
            fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' }
          }}
        >
          Smart Meal Planner
        </Typography>
        <Box sx={{ width: { xs: '40px', sm: '56px' } }} />
      </Box>

      {/* Generate Button */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mb: 4
        }}
      >
        <Button
          variant="contained"
          size="large"
          onClick={fetchMealPlan}
          disabled={loading}
          sx={{
            borderRadius: 8,
            px: 4,
            py: 2,
            backgroundColor: '#FF6B6B',
            '&:hover': {
              backgroundColor: '#ff5252',
            },
            color: 'white',
            fontSize: { xs: '1rem', sm: '1.1rem' },
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={20} sx={{ color: 'white' }} />
              Generating...
            </Box>
          ) : (
            'Plan your Meal for this week!'
          )}
        </Button>
      </Box>

      {/* Meal Plan Display */}
      <Container maxWidth="lg" sx={{ mb: 4 }}>
        {mealPlan.length > 0 && (
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              startIcon={<ContentCopyIcon />}
              onClick={copyFullMealPlan}
              sx={{
                color: '#FF6B6B',
                '&:hover': {
                  backgroundColor: 'rgba(255, 107, 107, 0.1)',
                },
              }}
            >
              Copy Full Meal Plan
            </Button>
          </Box>
        )}
        
        {mealPlan.length > 0 ? (
          <Grid container spacing={3}>
            {mealPlan.map((dayPlan, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  component={motion.div}
                  variants={fadeInUp}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  sx={{
                    borderRadius: 3,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    backgroundColor: 'white',
                    height: '100%',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      transition: 'transform 0.3s ease-in-out',
                      boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
                    },
                  }}
                >
                  <IconButton
                    onClick={() => copyDayPlan(dayPlan)}
                    sx={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      color: '#FF6B6B',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                      },
                    }}
                  >
                    <ContentCopyIcon />
                  </IconButton>
                  <CardContent sx={{ p: 3 }}>
                    <Typography 
                      variant="h5" 
                      gutterBottom 
                      sx={{ 
                        color: '#FF6B6B',
                        fontWeight: 'bold',
                        borderBottom: '2px solid #FFE5E5',
                        pb: 1,
                        mb: 2,
                        pr: 4 
                      }}
                    >
                      {dayPlan.day}
                    </Typography>
                    {Object.entries(dayPlan.meals).map(([mealType, meal], mealIndex) => (
                      <Box key={mealIndex} sx={{ mb: 2 }}>
                        <Typography 
                          variant="subtitle1" 
                          sx={{ 
                            color: '#FF6B6B',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1
                          }}
                        >
                          {getMealTypeIcon(mealType)} {mealType.charAt(0).toUpperCase() + mealType.slice(1)}:
                        </Typography>
                        <Typography 
                          variant="body1"
                          sx={{ 
                            ml: 4,
                            color: '#666',
                            fontSize: '0.95rem'
                          }}
                        >
                          {meal || 'No meal planned'}
                        </Typography>
                      </Box>
                    ))}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <EmptyState />
        )}
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbar.message}
        ContentProps={{
          sx: {
            backgroundColor: '#FF6B6B'
          }
        }}
      />
    </Box>
  );
};

export default SmartMealPlanner;