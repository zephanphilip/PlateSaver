import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useUser } from '@clerk/clerk-react';
import { format } from 'date-fns';
import { useNavigate } from "react-router-dom";

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionTypography = motion(Typography);

const Hero = () => {
  const navigate = useNavigate();
  // Letter animation configuration
  const letters = "PLATEFUL".split("");
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };
  
  const letterAnimation = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };
  const { user } = useUser();

    // Function to get the current time in 'HH:mm' format
    const getCurrentTime = () => {
      const currentTime = format(new Date(), 'HH:mm');
      return currentTime;
    };


    
  // Function to determine the meal type based on the current time
  const mealTime = () => {
    const time = getCurrentTime();
    const [hours, minutes] = time.split(':').map(Number);
    const currentMinutes = hours * 60 + minutes;

    let mealType = '';

    if (currentMinutes >= 300 && currentMinutes < 720) {
      mealType = 'Breakfast';
    } else if (currentMinutes >= 720 && currentMinutes < 900) {
      mealType = 'Lunch';
    } else if (currentMinutes >= 900 && currentMinutes < 1140) {
      mealType = 'Snacks';
    } else if (currentMinutes >= 1140 && currentMinutes < 1440) {
      mealType = 'Dinner';
    } else {
      mealType = 'Late Night Snacks';
    }

    return mealType;
  };

  return (
    <Box
      sx={{
        height: "100vh",
        backgroundColor: "#9dccfe",
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: {lg:25,xl:45},
          mb: 5
        }}
      >
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            display: "flex",
            pointerEvents: "none",
          }}
        >
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              variants={letterAnimation}
              style={{
                fontFamily: "Yanone Kaffeesatz, sans-serif",
                color: "#2a1581",
                fontSize: "clamp(200px, 30vw, 620px)",
                fontWeight: "bold",
                display: "inline-block",
                whiteSpace: "nowrap",
              }}
            >
              {letter}
            </motion.span>
          ))}
        </motion.div>

        <MotionCard
          initial={{ opacity: 0, rotateY: -180, scale: 0.1 }}
          animate={{ opacity: 1, rotateY: -380, scale: 1 }}
          whileHover={{scale: 1.2}}
          transition={{ duration: 1 }}
          sx={{
            width: "200px", 
            borderRadius: "5px",
            zIndex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.2)", // Transparent white
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.9)", // Strong shadow
            backdropFilter: "blur(10px)", // Blur effect for glass look
            border: "1px solid rgba(255, 255, 255, 0.3)", // Optional border for frosted outline
          }}
        >
          <CardContent sx={{ color: 'white' }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                textAlign: 'center',
                fontFamily: 'Rouge Script, cursive',
                fontWeight: 'bold'
              }}
            >
              Dear {user?.firstName},
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                textAlign: 'center',
                color: 'whitesmoke',
                fontFamily: 'Rouge Script, cursive',
                fontWeight: 'bold',
                
              }}
            >
              Welcome to Plate Saver, where every bite counts! Our app empowers you to make the most of your food, minimize waste, and share excess with those in need. Together, let's create a world where every plate is full and nothing goes to waste.
            </Typography>
          </CardContent>
        </MotionCard>
      </Box>

      <MotionBox
        initial={{ opacity: 0, x: -200 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        sx={{ ml: 9 }}
      >
        <Typography
          
          sx={{
            fontSize:{lg:32,xl:62},
            mt: {lg:6,xl:10},
            color: 'white',
            fontWeight: 'bold',
            fontFamily: 'Oswald,sans-serif'
          }}
        >
          Hey {user?.firstName} !
        </Typography>
        <Button
          variant="contained"
          sx={{
            fontWeight: 'bold',
            fontFamily: 'Oswald,sans-serif',
            fontSize: {lg:18,xl:22},
            backgroundColor: '#2a1581',
            '&:hover': {
              backgroundColor: '#43018f',
            },
          }}
          onClick={() => navigate('/instanttimelyrecipie')}
        >
          LET'S MAKE SOME {mealTime()} TOGETHER ?
        </Button>
      </MotionBox>
    </Box>
  );
};

export default Hero;
