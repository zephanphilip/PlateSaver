import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'
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


// HideOnScroll component to handle the slide animation
function HideOnScroll({ children }) {
  const trigger = useScrollTrigger({
    // Threshold in pixels before trigger is activated
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <HideOnScroll>
      <AppBar 
        position="fixed" 
        sx={{ 
          width: '100%', 
          backgroundColor: 'transparent',
          fontFamily:'Oswald,sans-serif',
           //backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
         backdropFilter: 'blur(10px)', // Blur effect
          fontWeight: 'bold',
          transition: 'transform 0.2s ease-in-out'
        }}
      >
        <Toolbar>
          <img src={logo} alt="Logo" height="40" />
          <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
            
          </div>
          <div>
          <Button 
              
              sx={{ 
                display: { xs: 'none', sm: 'inline-block' }, 
                fontWeight: 'bold' ,
                color: '#FFE5E5',
                fontFamily:'Oswald,sans-serif',
              }}
            >
              <Preferences isNavbarButton={true} />
            </Button>
            <Button 
              sx={{ 
                display: { xs: 'none', sm: 'inline-block' }, 
                fontWeight: 'bold' ,
                color: '#FFE5E5',
                fontFamily:'Oswald,sans-serif',
              }}
              onClick={() => window.location.href = '/donation'}
            >
              Donation
            </Button>
            <SignedOut>
        <SignInButton mode='modal'><Button 
              sx={{ 
                display: { xs: 'inline-block', sm: 'inline-block' }, 
                fontWeight: 'bold' ,
                color: '#FFE5E5',
                fontFamily:'Oswald,sans-serif',
              }}
            >
              Login
            </Button></SignInButton>
      </SignedOut>
      <SignedIn><Button><UserButton/></Button>
  
</SignedIn>


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
              <MenuItem onClick={handleClose}>Home</MenuItem>
              <MenuItem onClick={handleClose}>About Us</MenuItem>
              <MenuItem onClick={handleClose}>Contact Us</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
};

export default Navbar;
