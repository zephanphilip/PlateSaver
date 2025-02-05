import { SignedIn, SignedOut} from '@clerk/clerk-react'

import PantryPro from './components/PantryPro';
import CookLikeAChef from './components/CookLikeAChef';
import SmartMealPlanner from './components/SmartMealPlanner';
import WhatToCook from './components/WhatToCook';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CartCompanion from './components/CartCompanion';
import Startup from './components/Startup';
import InstantTimelyRecipie from './components/InstantTimelyRecipie';
import Donation from './components/Donation';
import Adoption from './components/Adoption';


function App() {
 
  return (
    <Router>
        <Routes>
          
          <Route path="/" element={<Startup/>}/>
          
          
          <Route path="/instanttimelyrecipie" element={<InstantTimelyRecipie/>}/>
          <Route path="/pantrypro" element={<SignedIn><PantryPro /></SignedIn>} />
          <Route path="/cooklikeachef" element={<SignedIn><CookLikeAChef /></SignedIn>} />
          <Route path="/mealplan" element={<SignedIn><SmartMealPlanner /></SignedIn>} />
          <Route path="/whattocook" element={<SignedIn><WhatToCook /></SignedIn>} />
          <Route path="/cartcomp" element={<SignedIn><CartCompanion/></SignedIn>}/>
          <Route path="/donation" element={<SignedIn><Donation/></SignedIn>} />
          <Route path="/adoption" element={<SignedIn><Adoption/></SignedIn>}/>
          
        </Routes>
    </Router>
  )
}

export default App
