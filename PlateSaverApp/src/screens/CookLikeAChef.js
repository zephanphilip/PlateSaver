import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const CookLikeAChef = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState(['Generate your Magic recipe!']);
  const [loading, setLoading] = useState(false);

  const parseRecipe = (text) => {
    const steps = text.match(/(\d+\.\s[^\n]+)/g);
    return steps || [];
  };

  const handleGenerateRecipe = async () => {
    if (prompt.trim()) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3001/api/ai/cooklikeachef', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recipe');
        }

        const data = await response.json();
        setResult(parseRecipe(data.recipe || 'No recipe found.'));
      } catch (error) {
        console.error('Error generating recipe:', error);
        setResult(['Failed to generate the recipe. Try again later.']);
      } finally {
        setLoading(false);
      }
    } else {
      setResult(['Please enter a valid prompt.']);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => console.log('Go back')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.title}>COOK LIKE A CHEF</Text>
        <View style={{ width: 56 }} /> {/* Placeholder for spacing */}
      </View>

      <ScrollView contentContainerStyle={styles.resultContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          result.map((line, index) => (
            <Text
              key={index}
              style={line.match(/^\d+\.\s/) ? styles.stepText : styles.headerText}
            >
              {line}
            </Text>
          ))
        )}
      </ScrollView>

      <View style={styles.promptContainer}>
        <TextInput
          style={styles.input}
          placeholder="Spicy Biriyani..."
          placeholderTextColor="rgba(255, 255, 255, 0.8)"
          value={prompt}
          onChangeText={setPrompt}
        />
        <TouchableOpacity style={styles.button} onPress={handleGenerateRecipe}>
          <Text style={styles.buttonText}>Generate Recipe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fe98ec',
    justifyContent: 'space-between',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    backgroundColor: '#2a1581',
    borderRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  resultContainer: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#ea098c',
    borderRadius: 8,
  },
  headerText: {
    color: 'white',
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  stepText: {
    color: 'white',
    fontSize: 16,
    marginBottom: 4,
  },
  promptContainer: {
    width: '100%',
    alignItems: 'center',
  },
  input: {
    width: '90%',
    maxWidth: 500,
    padding: 12,
    backgroundColor: '#ea098c',
    borderRadius: 8,
    color: 'white',
  },
  button: {
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#2a1581',
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CookLikeAChef;
