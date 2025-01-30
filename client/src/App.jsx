

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
          <Route path="/pantrypro" element={<PantryPro />} />
          <Route path="/cooklikeachef" element={<CookLikeAChef />} />
          <Route path="/mealplan" element={<SmartMealPlanner />} />
          <Route path="/whattocook" element={<WhatToCook />} />
          <Route path="/cartcomp" element={<CartCompanion/>}/>
          <Route path="/donation" element={<Donation/>} />
          <Route path="/adoption" element={<Adoption/>}/>
        </Routes>
    </Router>
  )
}

export default App
