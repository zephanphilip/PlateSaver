import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import React from 'react';
import { useUser } from '@clerk/clerk-expo';
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

export default function TimelyRecipie() {
  const { user } = useUser();

  return (
    <View style={styles.welcomeSection}>
      <Text style={styles.greeting}>
        Hello, {user?.firstName || 'Guest'}!
      </Text>
      <Text style={styles.questionText}>
        Not sure what to cook for{' '}
        <Text style={styles.highlightText}>{mealTime()}?</Text>
      </Text>
      <TouchableOpacity style={styles.reassuranceBox} activeOpacity={0.8}>
        <Text style={styles.reassuranceText}>Don't worry, we got you!</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeSection: {
    marginBottom: 14,
    paddingHorizontal: 15,
  },
  greeting: {
    fontSize: 18,
    color: '#666',
    marginBottom: 8,
  },
  questionText: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  highlightText: {
    color: '#F05454',
  },
  reassuranceBox: {
    backgroundColor: '#F05454',
    padding: 12,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  reassuranceText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
