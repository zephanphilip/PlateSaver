import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Display } from '../utils';
import { Seperator } from '../components';
import { General } from '../constants';

const CookLikeAChef = () => {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateRecipe = async () => {
    if (prompt.trim()) {
      setLoading(true);
      console.log('Generating')
      try {
        const response = await fetch(`${General.API_BASE_URL}api/ai/cooklikeachef`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ prompt }),
        });
  
        if (!response.ok) throw new Error('Failed to fetch recipe');
        const data = await response.json();
        setResult([data.recipe]); // Treat the entire recipe as a single string
      } catch (error) {
        console.error('Error:', error);
        setResult(['Failed to generate recipe. Please try again.']);
      } finally {
        setLoading(false);
      }
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor="#fff" translucent/>
      <Seperator height={StatusBar.currentHeight}/>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <Text style={styles.title}>Cook Like A Chef!</Text>
        <View style={styles.contentContainer}>
          {loading && <ActivityIndicator size="large" color="#FF6B6B" style={styles.loader} />}
          {result.length === 0 ? (
            <Text style={styles.subtitle}>
              Discover recipes tailored to your cravings and dietary needs!
            </Text>
          ) : (
            <ScrollView style={styles.resultScroll}>
              {result.map((step, index) => (
      <Text key={index} style={styles.recipeStep}>{step}</Text>
    ))}
            </ScrollView>
          )}
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Spicy chicken biriyani"
            placeholderTextColor="#888"
            value={prompt}
            onChangeText={setPrompt}
            returnKeyType="done"
          />
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleGenerateRecipe}
          >
            <Ionicons name="arrow-forward" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#FF6B6B',
    textAlign: 'center',
    marginTop: 20,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
    textAlign: 'left',
    backgroundColor: '#FFE4E4',
    padding: 20,
    borderRadius: 20,
  },
  resultScroll: {
    maxHeight: Display.setHeight(70),
    marginTop: 20,
    color: 'black',
    backgroundColor: '#FFE4E4',
    padding: 15,
    borderRadius: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFE4E4',
    borderRadius: 30,
    margin: 20,
  },
  input: {
    flex: 1,
    fontSize: 18,
    color: 'black',
    paddingVertical: 8,
  },
  submitButton: {
    backgroundColor: '#FFE4E4',
    padding: 8,
    borderRadius: 20,
  },
  loader: {
    marginTop: 20,
  },
  recipeStep: {
    fontSize: 16,
    color: 'black',
    marginVertical: 14,
  },
});

export default CookLikeAChef;
