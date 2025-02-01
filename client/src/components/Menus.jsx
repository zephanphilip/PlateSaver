// import { Box, Typography, Grid, Card, CardMedia, CardContent, Button } from "@mui/material";
// import cartcomp from '../assets/cartcompaninon.jpeg';
// import chef from '../assets/chef.png';
// import mealplan from '../assets/mealplan.jpg';
// import pantrypro from '../assets/pantrypro.jpeg';
// import whatscooking from '../assets/wgatscooking.jpg';
// import { motion } from "framer-motion"
// import { useNavigate } from 'react-router-dom';
// import { useUser } from "@clerk/clerk-react";


// const MotionBox = motion(Box);
// const MotionCard = motion(Card);




// const Menus = () => {
//   const { user, isLoaded } = useUser();
//   const navigate = useNavigate();
//   const menus = [
//     {
//       name: 'Cook Like A Chef!',
//       desc: 'Discover recipes tailored to your cravings or dietary needs',
//       img: chef,
//       route: '/cooklikeachef',
//     },
//     {
//       name: 'What to Cook?',
//       desc: 'Discover recipes using only what\'s in your pantry',
//       img: whatscooking,
//       route: '/whattocook',
//     },
//     {
//       name: 'Smart Meal Planner',
//       desc: 'Plan your meals with personalized suggestions',
//       img: mealplan,
//       route: '/mealplan',
//     },
//     {
//       name: 'Pantry Pro',
//       desc: 'Organize your food inventory and manage your list',
//       img: cartcomp,
//       route: '/pantrypro',
//     },
//     {
//       name: 'Cart Companion',
//       desc: 'Manage your shopping list and be ready for grocery runs',
//       img: pantrypro,
//       route: '/cartcomp',
//     }
//   ];
  
//   return (
//     <MotionBox
//     sx={{ px: 4,justifyContent:'center' }}>
//       <Typography variant="h3" component="h2" gutterBottom sx={{textAlign:'center',fontFamily: "Yanone Kaffeesatz, sans-serif",fontWeight:'bold',color:'white'}}>
//         Explore Our Delicious Menus
//       </Typography>
//       <Grid container spacing={3} sx={{justifyContent:'center'}}>
//         {menus.map((menu, index) => (
//           <Grid item xs={12} sm={6} md={4} key={index}>
//             <MotionCard 
//             initial={{opacity:0,y:100}}
//             whileInView={{opacity:1,y:0}}
//             transition={{ duration:0.6}}
//             whileHover={{ scale:1.02}}
//             onClick={() => navigate(menu.route)}
//             sx={{ height: '100%',
//                  borderRadius:'15px',
//                  backgroundColor: "rgba(255, 255, 255, 0.2)", // Transparent white
//                 boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.9)", // Strong shadow
//                 backdropFilter: "blur(10px)", // Blur effect for glass look
                
//              color:'white' }}>
//               <CardMedia
//                 component="img"
//                 height="300"
//                 image={menu.img}
//                 alt={menu.name}
//               />
//               <CardContent >
//                 <Typography variant="h5" component="h3"  sx={{fontFamily: "Yanone Kaffeesatz, sans-serif",fontWeight:'bold'}}>
//                   {menu.name}
//                 </Typography>
//                 <Typography variant="body1" color="white" sx={{fontFamily: "Oswald,sans-serif",}}>
//                   {menu.desc}
//                 </Typography>
//               </CardContent>
//             </MotionCard>
//           </Grid>
//         ))}
//       </Grid>
//     </MotionBox>
//   );
// }

// export default Menus;


import { Box, Typography, Grid, Card, CardMedia, CardContent, Button } from "@mui/material";
import cartcomp from '../assets/cartcompaninon.jpeg';
import chef from '../assets/chef.png';
import mealplan from '../assets/mealplan.jpg';
import pantrypro from '../assets/pantrypro.jpeg';
import whatscooking from '../assets/wgatscooking.jpg';
import { motion } from "framer-motion"
import { useNavigate } from 'react-router-dom';
import { useUser, SignInButton } from "@clerk/clerk-react";


const MotionBox = motion(Box);
const MotionCard = motion(Card);

const Menus = () => {
  const { user, isLoaded } = useUser();
  const navigate = useNavigate();

  const menus = [
    {
      name: 'Cook Like A Chef!',
      desc: 'Discover recipes tailored to your cravings or dietary needs',
      img: chef,
      route: '/cooklikeachef',
    },
    {
      name: 'What to Cook?',
      desc: 'Discover recipes using only what\'s in your pantry',
      img: whatscooking,
      route: '/whattocook',
    },
    {
      name: 'Smart Meal Planner',
      desc: 'Plan your meals with personalized suggestions',
      img: mealplan,
      route: '/mealplan',
    },
    {
      name: 'Pantry Pro',
      desc: 'Organize your food inventory and manage your list',
      img: cartcomp,
      route: '/pantrypro',
    },
    {
      name: 'Cart Companion',
      desc: 'Manage your shopping list and be ready for grocery runs',
      img: pantrypro,
      route: '/cartcomp',
    }
  ];

  const handleMenuClick = (route) => {
    if (!isLoaded) {
      return; // Wait for auth state to load
    }
    
    if (user) {
      // If user is signed in, navigate to the selected route
      navigate(route);
    }
  };

  const MenuCard = ({ menu }) => (
    <MotionCard
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      whileHover={{ scale: 1.02 }}
      sx={{
        height: '100%',
        borderRadius: '15px',
        backgroundColor: "rgba(255, 255, 255, 0.2)",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.9)",
        backdropFilter: "blur(10px)",
        color: 'white',
        cursor: 'pointer'
      }}
    >
      <CardMedia
        component="img"
        height="300"
        image={menu.img}
        alt={menu.name}
      />
      <CardContent>
        <Typography 
          variant="h5" 
          component="h3" 
          sx={{
            fontFamily: "Yanone Kaffeesatz, sans-serif",
            fontWeight: 'bold'
          }}
        >
          {menu.name}
        </Typography>
        <Typography 
          variant="body1" 
          color="white" 
          sx={{
            fontFamily: "Oswald, sans-serif"
          }}
        >
          {menu.desc}
        </Typography>
      </CardContent>
    </MotionCard>
  );

  return (
    <MotionBox sx={{ px: 4, justifyContent: 'center' }}>
      <Typography 
        variant="h3" 
        component="h2" 
        gutterBottom 
        sx={{
          textAlign: 'center',
          fontFamily: "Yanone Kaffeesatz, sans-serif",
          fontWeight: 'bold',
          color: 'white'
        }}
      >
        Explore Our Delicious Menus
      </Typography>
      <Grid container spacing={3} sx={{ justifyContent: 'center' }}>
        {menus.map((menu, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            {user ? (
              <div onClick={() => handleMenuClick(menu.route)}>
                <MenuCard menu={menu} />
              </div>
            ) : (
              <SignInButton mode="modal">
                <div>
                  <MenuCard menu={menu} />
                </div>
              </SignInButton>
            )}
          </Grid>
        ))}
      </Grid>
    </MotionBox>
  );
};

export default Menus;