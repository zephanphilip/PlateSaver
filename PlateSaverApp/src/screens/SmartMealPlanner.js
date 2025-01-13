import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Animated,
  Clipboard,
  Alert,
  StatusBar
} from 'react-native';
import { useUser } from "@clerk/clerk-expo";
import { General } from '../constants';
import { Seperator } from '../components';

const SmartMealPlanner = ({ navigation }) => {
  const { user, isLoaded } = useUser();
  const [mealPlan, setMealPlan] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchMealPlan = async () => {
    setLoading(true);
    if (isLoaded && user) {
      try {
        const response = await fetch(`${General.API_BASE_URL}api/ai/mealplan?userId=${user.id}`);
        const data = await response.json();
        
        if (Array.isArray(data.mealPlan)) {
          setMealPlan(data.mealPlan);
        } else {
          console.error('Received meal plan is not an array:', data.mealPlan);
          setMealPlan([]);
        }
      } catch (error) {
        console.error('Error fetching meal plan:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const copyMealPlan = async (dayPlan) => {
    try {
      let mealText = `${dayPlan.day}\n`;
      Object.entries(dayPlan.meals).forEach(([mealType, meal]) => {
        mealText += `${mealType.charAt(0).toUpperCase() + mealType.slice(1)}: ${meal || 'No meal planned'}\n`;
      });
      await Clipboard.setString(mealText);
      Alert.alert('Success', 'Meal plan copied to clipboard!');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy meal plan');
      console.error('Error copying meal plan:', error);
    }
  };

  const copyEntireMealPlan = async () => {
    try {
      let fullMealPlan = mealPlan.map(dayPlan => {
        let dayText = `${dayPlan.day}\n`;
        Object.entries(dayPlan.meals).forEach(([mealType, meal]) => {
          dayText += `${mealType.charAt(0).toUpperCase() + mealType.slice(1)}: ${meal || 'No meal planned'}\n`;
        });
        return dayText;
      }).join('\n');
      
      await Clipboard.setString(fullMealPlan);
      Alert.alert('Success', 'Full week meal plan copied to clipboard!');
    } catch (error) {
      Alert.alert('Error', 'Failed to copy meal plan');
      console.error('Error copying full meal plan:', error);
    }
  };

  const MealCard = ({ dayPlan }) => (
    <Animated.View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.dayTitle}>{dayPlan.day}</Text>
        <TouchableOpacity
          style={styles.copyButton}
          onPress={() => copyMealPlan(dayPlan)}
        >
          <Text style={styles.copyButtonText}>Copy</Text>
        </TouchableOpacity>
      </View>
      {Object.entries(dayPlan.meals).map(([mealType, meal], index) => (
        <Text key={index} style={styles.mealText}>
          {mealType.charAt(0).toUpperCase() + mealType.slice(1)}: {meal || 'No meal planned'}
        </Text>
      ))}
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor="#fff" translucent/>
      <Seperator height={StatusBar.currentHeight}/>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Smart Meal Planner</Text>
      </View>

      {/* Generate Button */}
      <TouchableOpacity
        style={[styles.generateButton, loading && styles.disabledButton]}
        onPress={fetchMealPlan}
        disabled={loading}
      >
        <Text style={styles.generateButtonText}>
          {loading ? 'Generating...' : 'Plan your Meal for this week!'}
        </Text>
      </TouchableOpacity>

      {/* Meal Plan Display */}
      {loading ? (
        <ActivityIndicator size="large" color="#2a1581" />
      ) : (
        <ScrollView style={styles.scrollView}>
          {mealPlan.length > 0 ? (
            <>
              <TouchableOpacity
                style={styles.copyAllButton}
                onPress={copyEntireMealPlan}
              >
                <Text style={styles.copyAllButtonText}>Copy Full Week</Text>
              </TouchableOpacity>
              {mealPlan.map((dayPlan, index) => (
                <MealCard key={index} dayPlan={dayPlan} />
              ))}
            </>
          ) : (
            <Text style={styles.noMealText}>
              Generate a meal plan to get started!
            </Text>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  generateButton: {
    justifyContent: 'center',
    backgroundColor: '#FFE5E5',
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  generateButtonText: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  dayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  mealText: {
    fontSize: 16,
    marginVertical: 4,
  },
  noMealText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  copyButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  copyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  copyAllButton: {
    backgroundColor: '#FF6B6B',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  copyAllButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SmartMealPlanner;