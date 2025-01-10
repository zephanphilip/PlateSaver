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
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { Display } from '../utils';
import { Seperator } from '../components';

const WhatToCook = () => {
  const { user, isLoaded } = useUser();
  const [recipes, setRecipes] = useState([]);
  const [currentRecipeIndex, setCurrentRecipeIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch(
          `http://192.168.234.229:3001/api/ai/whattocook?userId=${user.id}`
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
        setLoading(false);
      } catch (error) {
        console.error('Detailed error fetching recipes:', error);
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [user, isLoaded]);

  const handleSkip = () => {
    setCurrentRecipeIndex((prevIndex) => (prevIndex + 1) % recipes.length);
  };

  const getCurrentRecipe = () => {
    if (recipes.length === 0) return null;
    return recipes[currentRecipeIndex];
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
      {/* Header */}
      <Text style={styles.title}>What to Cook...?</Text>

      {/* Main Content */}
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

      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipButtonText}>SKIP</Text>
      </TouchableOpacity>
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
    marginVertical:20,
    marginHorizontal:20,
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
  skipButton: {
    backgroundColor: '#FFE5E5',
    padding: 15,
    borderRadius: 25,

    width: '100%',
    marginBottom: 20,

  },
  skipButtonText: {
    color: '#FF6B6B',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WhatToCook;