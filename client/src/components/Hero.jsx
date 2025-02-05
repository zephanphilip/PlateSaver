import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { motion } from "framer-motion";
import { useUser } from '@clerk/clerk-react';
import { format } from 'date-fns';
import { useNavigate } from "react-router-dom";
import Menus from "./Menus";

const MotionBox = motion(Box);
const MotionCard = motion(Card);
const MotionTypography = motion(Typography);

const Hero = () => {
  const navigate = useNavigate();
  const letters = "PLATEFUL".split("");

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const letterAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };
  const { user } = useUser();

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

  return (
    <Box
      sx={{
        height: "100%",
       
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        mt:{ xs: 10,md:14, lg: 24,xl:34 },
        p: { xs: 2, md: 4 },
      }}
    >
      <Box
        sx={{
          position: "relative",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mb: 5,
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
                color: "#FFE5E5",
                fontSize: "clamp(35vw, 35vw, 35vw)",
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
          animate={{ opacity: 1, rotateY: -360, scale: 1 }}
          whileHover={{ scale: 1.2 }}
          transition={{ duration: 1.5 }}
          sx={{
            maxWidth: "60%",
            width: { xs: "60%", sm: "40%", md: "30%" },
            borderRadius: "10px",
            zIndex: 1,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.8)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255, 255, 255, 0.3)",
            p: 1,
          }}
        >
          <CardContent sx={{ color: 'white' }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ textAlign: 'center', fontFamily: 'Rouge Script, cursive', fontWeight: 'bold' }}
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
        sx={{ width: "100%", textAlign: "center", px: { xs: 1, md: 3 } }}
      >
        <Typography
          sx={{
            fontSize: { xs: 20, md: 32, xl: 62 },
            mt: { xs: 2, md: 2, lg: 5 },
            color: 'white',
            fontWeight: 'bold',
            fontFamily: 'Oswald, sans-serif',
          }}
        >
          Hey {user?.firstName}!
        </Typography>
        <Button
          variant="contained"
          sx={{
            fontWeight: 'bold',
            fontFamily: 'Oswald, sans-serif',
            fontSize: { xs: 14, md: 18, xl: 22 },
            color:'#FF6B6B',
            backgroundColor: '#FFE5E5',
            '&:hover': {
              backgroundColor: '#FF6B6B',
              color:'#FFE5E5'
            },
            mt: 2,
          }}
          onClick={() => navigate('/instanttimelyrecipie')}
        >
          LET'S MAKE SOME {mealTime()} TOGETHER?
        </Button>
      </MotionBox>
     
    </Box>
  );
};

export default Hero;


