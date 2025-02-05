import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useUser } from '@clerk/clerk-expo';
import { Display } from '../utils';
import { Seperator } from '../components';
import { General } from '../constants';
import { format } from 'date-fns';

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

  if (currentMinutes >= 300 && currentMinutes < 720) {
    return 'Breakfast';
  } else if (currentMinutes >= 720 && currentMinutes < 900) {
    return 'Lunch';
  } else if (currentMinutes >= 900 && currentMinutes < 1140) {
    return 'Snacks';
  } else if (currentMinutes >= 1140 && currentMinutes < 1440) {
    return 'Dinner';
  } else {
    return 'Late Night Snacks';
  }
};


export default function TimelyRecipieScreen() {
  const { user, isLoaded } = useUser();
   const [recipes, setRecipes] = useState([]);
   const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
   const [loading, setLoading] = useState(true);
   const [currentMealTime, setCurrentMealTime] = useState(mealTime());
 
   const fetchRecipe = async () => {
     try {
       setLoading(true);
       const response = await fetch(
         `${General.API_BASE_URL}api/ai/whattocook?userId=${user.id}&mealTime=${currentMealTime}`
       );
 
       if (!response.ok) {
         const errorText = await response.text();
         throw new Error(`Failed to fetch recipes: ${response.status} ${errorText}`);
       }
 
       const data = await response.json();
 
       if (!data || !data.recipe) {
         throw new Error('No recipe data received');
       }
 
       const recipeObj = {
         title: 'Recipe',
         description:
           typeof data.recipe === 'string'
             ? data.recipe.split('\n').filter(step => step.trim() !== '')
             : [],
       };
 
       setRecipes([recipeObj]);
       setCurrentRecipeIndex(0);
       setLoading(false);
     } catch (error) {
      
       setLoading(false);
       Alert.alert('Error', 'Failed to generate new recipe.  Try adding items to your Pantry.');
     }
   };
 
   useEffect(() => {
    // Update current meal time and fetch recipe when component mounts
    const mealTimes = mealTime();
    setCurrentMealTime(mealTimes);
    fetchRecipe();
   }, [user, isLoaded]);
 
   const handleSkip = () => {
     fetchRecipe();
   };
 
   const getCurrentRecipe = () => {
     if (recipes.length === 0) return null;
     return recipes[currentRecipeIndex];
   };
 
   const handleCopyRecipe = async () => {
     const currentRecipe = getCurrentRecipe();
     if (!currentRecipe) return;
 
     const recipeText = [
       currentRecipe.title,
       '',
       ...currentRecipe.description
     ].join('\n');
 
     try {
       await Clipboard.setStringAsync(recipeText);
       Alert.alert('Success', 'Recipe copied to clipboard!');
     } catch (error) {
       Alert.alert('Error', 'Failed to copy recipe');
     }
   };
 
   if (loading) {
     return (
       <View style={styles.loadingContainer}>
         <ActivityIndicator size="large" color="#fb6428" />
         <Text style={styles.loadingText}>Loading recipes...</Text>
       </View>
     );
   }
 
   const currentRecipe = getCurrentRecipe();
 
   return (
     <SafeAreaView style={styles.container}>
       <StatusBar barStyle='dark-content' backgroundColor="#fff" translucent/>
       <Seperator height={StatusBar.currentHeight}/>
       <Text style={styles.title}>Your Recipe for Delecious {mealTime()} is Here !</Text>
 
       <View style={styles.mainContent}>
         <ScrollView 
           style={styles.scrollView}
           contentContainerStyle={styles.scrollViewContent}
           showsVerticalScrollIndicator={false}
         >
           {currentRecipe ? (
             <>
               <Text style={styles.recipeTitle}>{currentRecipe.title}</Text>
               {currentRecipe.description.map((step, index) => (
                 <Text key={index} style={styles.recipeStep}>
                   {step}
                 </Text>
               ))}
             </>
           ) : (
             <Text style={styles.subtitle}>No recipes available</Text>
           )}
         </ScrollView>
       </View>
 
       <View style={styles.buttonContainer}>
         <TouchableOpacity style={styles.copyButton} onPress={handleCopyRecipe}>
           <Text style={[styles.buttonText, { color: '#fff' }]}>COPY RECIPE</Text>
         </TouchableOpacity>
         <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
           <Text style={[styles.buttonText, { color: '#FF6B6B' }]}>SKIP</Text>
         </TouchableOpacity>
       </View>
     </SafeAreaView>
   );
 };
 
 const styles = StyleSheet.create({
   container: {
     flex: 1,
     backgroundColor: 'white',
     padding: 20,
   },
   loadingContainer: {
     flex: 1,
     justifyContent: 'center',
     alignItems: 'center',
   },
   loadingText: {
     marginTop: 10,
     fontSize: 16,
     color: '#666',
   },
   title: {
     fontSize: 32,
     fontWeight: 'bold',
     color: '#FF6B6B',
     textAlign: 'center',
     marginTop: 20,
   },
   mainContent: {
     flex: 1,
     backgroundColor: '#FFE5E5',
     borderRadius: 25,
     maxHeight: Display.setHeight(70),
     marginVertical: 20,
     marginHorizontal: 20,
     padding: 20,
   },
   scrollView: {
     flex: 1,
   },
   scrollViewContent: {
     flexGrow: 1,
     paddingBottom: 20,
   },
   recipeTitle: {
     fontSize: 24,
     fontWeight: 'bold',
     color: 'black',
     textAlign: 'center',
     marginBottom: 20,
   },
   recipeStep: {
     fontSize: 16,
     color: 'black',
     marginBottom: 10,
     lineHeight: 24,
     textAlign: 'left',
     paddingHorizontal: 10,
   },
   subtitle: {
     fontSize: 28,
     fontWeight: 'bold',
     color: 'black',
     textAlign: 'center',
     lineHeight: 40,
   },
   buttonContainer: {
     flexDirection: 'row',
     justifyContent: 'space-between',
     marginBottom: 20,
     gap: 10,
     marginHorizontal: 10,
   },
   copyButton: {
     flex: 1,
     backgroundColor: '#FF6B6B',
     padding: 15,
     borderRadius: 25,
   },
   skipButton: {
     flex: 1,
     backgroundColor: '#FFE5E5',
     padding: 15,
     borderRadius: 25,
   },
   buttonText: {
     textAlign: 'center',
     fontSize: 18,
     fontWeight: 'bold',
   },
 });