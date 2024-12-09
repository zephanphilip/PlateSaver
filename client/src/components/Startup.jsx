import { Box } from '@mui/material'
import React from 'react'
import Navbar from './Navbar';
import Hero from './Hero';
import Menus from './Menus';

const Startup = () => {
  return (
    <Box sx={{display:'flex', flexDirection:'column'}}>
        <Navbar/>
        <Hero/>
        <Menus/>
    </Box>
  )
}

export default Startup
