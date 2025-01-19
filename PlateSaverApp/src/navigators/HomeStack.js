
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react'
import { Home,CookLikeAChef, WhatToCook, SmartMealPlanner, CartCompanion, PantryPro, InstantRecipie, Preferences, Donation } from "../screens";
import TimelyRecipieScreen from '../screens/TimelyRecipieScreen';

const Stack = createStackNavigator();

const HomeStack = () => {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="HomeScreen"  component={Home} />
        <Stack.Screen name="CookLikeAChef" component={CookLikeAChef}  />
        <Stack.Screen name="WhatToCook" component={WhatToCook} />
        <Stack.Screen name="SmartMealPlanner" component={SmartMealPlanner} />
        <Stack.Screen name="CartCompanion" component={CartCompanion} />
        <Stack.Screen name="PantryPro" component={PantryPro} />
        <Stack.Screen name="InstantRecipe" component={InstantRecipie} />
        <Stack.Screen name="Preferences" component={Preferences} />
        <Stack.Screen name="Donation" component={Donation} />
        <Stack.Screen name="TimelyRecipie" component={TimelyRecipieScreen} />
      </Stack.Navigator>
    );
  };
  
  export default HomeStack;