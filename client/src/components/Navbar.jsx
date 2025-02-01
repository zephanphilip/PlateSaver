// import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
// import React, { useState } from 'react';
// import { 
//   AppBar, 
//   Toolbar, 
//   Button, 
//   IconButton, 
//   Menu, 
//   MenuItem,
//   Slide,
//   useScrollTrigger,
//   Box
// } from '@mui/material';
// import { Menu as MenuIcon } from '@mui/icons-material';
// import logo from '../assets/logo.png';
// import Preferences from './Preferences';


// // HideOnScroll component to handle the slide animation
// function HideOnScroll({ children }) {
//   const trigger = useScrollTrigger({
//     // Threshold in pixels before trigger is activated
//     threshold: 100,
//   });

//   return (
//     <Slide appear={false} direction="down" in={!trigger}>
//       {children}
//     </Slide>
//   );
// }

// const Navbar = () => {
//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   return (
//     <HideOnScroll>
//       <AppBar 
//         position="fixed" 
//         sx={{ 
//           width: '100%', 
//           backgroundColor: 'transparent',
//           fontFamily:'Oswald,sans-serif',
          
//          backdropFilter: 'blur(10px)', 
//           fontWeight: 'bold',
//           transition: 'transform 0.2s ease-in-out'
//         }}
//       >
//         <Toolbar>
//           <img src={logo} alt="Logo" height="40" />
//           <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            
//           </div>
//           <div>
//           <Button 
              
//               sx={{ 
//                 display: { xs: 'none', sm: 'inline-block' }, 
//                 fontWeight: 'bold' ,
//                 color: '#FFE5E5',
//                 fontFamily:'Oswald,sans-serif',
//               }}
//             >
//               <Preferences isNavbarButton={true} />
//             </Button>
//             <Button 
//               sx={{ 
//                 display: { xs: 'none', sm: 'inline-block' }, 
//                 fontWeight: 'bold' ,
//                 color: '#FFE5E5',
//                 fontFamily:'Oswald,sans-serif',
//               }}
//               onClick={() => window.location.href = '/adoption'}
//             >
//               Adoption
//             </Button>
//             <Button 
//               sx={{ 
//                 display: { xs: 'none', sm: 'inline-block' }, 
//                 fontWeight: 'bold' ,
//                 color: '#FFE5E5',
//                 fontFamily:'Oswald,sans-serif',
//               }}
//               onClick={() => window.location.href = '/donation'}
//             >
//               Donation
//             </Button>
//             <SignedOut>
//         <SignInButton mode='modal'><Button 
//               sx={{ 
//                 display: { xs: 'inline-block', sm: 'inline-block' }, 
//                 fontWeight: 'bold' ,
//                 color: '#FFE5E5',
//                 fontFamily:'Oswald,sans-serif',
//               }}
//             >
//               Login
//             </Button></SignInButton>
//       </SignedOut>
//       <SignedIn><Button><UserButton/></Button>
  
// </SignedIn>


//             <IconButton
//               color="inherit"
//               aria-label="menu"
//               aria-controls="menu-appbar"
//               aria-haspopup="true"
//               onClick={handleClick}
//               sx={{ display: { xs: 'inline-block', sm: 'none' } }}
//             >
//               <MenuIcon />
//             </IconButton>
//             <Menu
//               id="menu-appbar"
//               anchorEl={anchorEl}
//               anchorOrigin={{
//                 vertical: 'top',
//                 horizontal: 'right',
//               }}
//               keepMounted
//               transformOrigin={{
//                 vertical: 'top',
//                 horizontal: 'right',
//               }}
//               open={open}
//               onClose={handleClose}
//             >
//               <MenuItem onClick={() => window.location.href = '/donation'}>Donation</MenuItem>
//               <MenuItem  onClick={() => window.location.href = '/adoption'}>Adoption</MenuItem>
//             </Menu>
//           </div>
//         </Toolbar>
//       </AppBar>
//     </HideOnScroll>
//   );
// };

// export default Navbar;


import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from '@clerk/clerk-react'
import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Button, 
  IconButton, 
  Menu, 
  MenuItem,
  Slide,
  useScrollTrigger,
  Box
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import logo from '../assets/logo.png';
import Preferences from './Preferences';
import { useNavigate } from 'react-router-dom';

function HideOnScroll({ children }) {
  const trigger = useScrollTrigger({
    threshold: 100,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children}
    </Slide>
  );
}

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProtectedNavigation = (route) => {
    if (user) {
      navigate(route);
      handleClose();
    }
  };

  // Wrapper component for protected buttons
  const ProtectedButton = ({ children, route }) => (
    <>
      {user ? (
        <Button
          onClick={() => handleProtectedNavigation(route)}
          sx={{
            fontWeight: 'bold',
            color: '#FFE5E5',
            fontFamily: 'Oswald,sans-serif',
          }}
        >
          {children}
        </Button>
      ) : (
        <SignInButton mode="modal">
          <Button
            sx={{
              fontWeight: 'bold',
              color: '#FFE5E5',
              fontFamily: 'Oswald,sans-serif',
            }}
          >
            {children}
          </Button>
        </SignInButton>
      )}
    </>
  );

  // Wrapper component for protected menu items
  const ProtectedMenuItem = ({ children, route }) => (
    <>
      {user ? (
        <MenuItem onClick={() => handleProtectedNavigation(route)}>
          {children}
        </MenuItem>
      ) : (
        <SignInButton mode="modal">
          <MenuItem>
            {children}
          </MenuItem>
        </SignInButton>
      )}
    </>
  );

  return (
    <HideOnScroll>
      <AppBar 
        position="fixed" 
        sx={{ 
          width: '100%', 
          backgroundColor: 'transparent',
          fontFamily: 'Oswald,sans-serif',
          backdropFilter: 'blur(10px)', 
          fontWeight: 'bold',
          transition: 'transform 0.2s ease-in-out'
        }}
      >
        <Toolbar>
          <img 
            src={logo} 
            alt="Logo" 
            height="40" 
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/')}
          />
          <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
          </div>
          <div>
            {/* Desktop View Buttons */}
            <Box sx={{ display: { xs: 'none', sm: 'inline-block' } }}>
              {user ? (
                <Button 
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#FFE5E5',
                    fontFamily: 'Oswald,sans-serif',
                  }}
                >
                  <Preferences isNavbarButton={true} />
                </Button>
              ) : (
                <SignInButton mode="modal">
                  <Button 
                    sx={{ 
                      fontWeight: 'bold',
                      color: '#FFE5E5',
                      fontFamily: 'Oswald,sans-serif',
                    }}
                  >
                    <Preferences isNavbarButton={true} />
                  </Button>
                </SignInButton>
              )}
              <ProtectedButton route="/adoption">
                Adoption
              </ProtectedButton>
              <ProtectedButton route="/donation">
                Donation
              </ProtectedButton>
            </Box>

            {/* Authentication Buttons */}
            <SignedOut>
              <SignInButton mode='modal'>
                <Button 
                  sx={{ 
                    fontWeight: 'bold',
                    color: '#FFE5E5',
                    fontFamily: 'Oswald,sans-serif',
                  }}
                >
                  Login
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <Button>
                <UserButton />
              </Button>
            </SignedIn>

            {/* Mobile Menu Icon */}
            <IconButton
              color="inherit"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleClick}
              sx={{ display: { xs: 'inline-block', sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            {/* Mobile Menu */}
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              {user ? (
                <MenuItem>
                  <Preferences isNavbarButton={false} />
                </MenuItem>
              ) : (
                <SignInButton mode="modal">
                  <MenuItem>
                    <Preferences isNavbarButton={false} />
                  </MenuItem>
                </SignInButton>
              )}
              <ProtectedMenuItem route="/donation">
                Donation
              </ProtectedMenuItem>
              <ProtectedMenuItem route="/adoption">
                Adoption
              </ProtectedMenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;