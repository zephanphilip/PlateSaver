import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { RadioButton } from 'react-native-paper';
import { useUser } from '@clerk/clerk-expo';
import { useNavigation } from '@react-navigation/native';
import { General } from '../constants';
import { Seperator } from '../components';

const Preferences = () => {
  const navigation = useNavigation();
  const { user, isLoaded } = useUser();
  const [preferences, setPreferences] = useState({
    username: '',
    dietary: '',
    cuisine: '',
    spiceLevel: '',
    cookingTime: '',
    culinarySkills: '',
    allergies: '',
  });
  const [existingPreferenceId, setExistingPreferenceId] = useState(null);

  useEffect(() => {
    if (isLoaded && user) {
      setPreferences(prev => ({
        ...prev,
        username: user.id,
      }));
    }
  }, [isLoaded, user]);

  useEffect(() => {
    if (isLoaded && user) {
      fetchPreferences();
    }
  }, [isLoaded, user]);

  const fetchPreferences = async () => {
    try {
      const response = await fetch(
        `${General.API_BASE_URL}api/preferences/${user.id}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data && data[0]) {
          setPreferences(data[0]);
          setExistingPreferenceId(data[0]._id);
        }
      }
    } catch (error) {
      console.error('Error fetching preferences:', error);
    }
  };

  const handleChange = (key, value) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    const { _id, __v, ...cleanPreferences } = preferences;
    const isUpdate = !!existingPreferenceId;
    const url = isUpdate
      ? `${General.API_BASE_URL}api/preferences/${existingPreferenceId}`
      : `${General.API_BASE_URL}api/preferences`;

    const method = isUpdate ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanPreferences),
      });

      if (response.ok) {
        console.log('Preferences saved successfully');
        navigation.goBack(); // Navigate back after saving
      } else {
        const errorData = await response.json();
        console.error('Failed to save preferences:', errorData);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const renderRadioOption = (value, selected, onSelect) => (
    <TouchableOpacity
      style={styles.radioOption}
      onPress={() => onSelect(value)}
      key={value}
    >
      <RadioButton
        value={value}
        status={selected === value ? 'checked' : 'unchecked'}
        onPress={() => onSelect(value)}
        color="#43018f"
      />
      <Text style={styles.radioLabel}>{value}</Text>
    </TouchableOpacity>
  );

  const renderSection = (label, options, key, direction = 'row') => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{label}</Text>
      <View style={[
        styles.optionsContainer,
        direction === 'column' && styles.columnContainer
      ]}>
        {options.map((option) => (
          renderRadioOption(
            option,
            preferences[key],
            (value) => handleChange(key, value)
          )
        ))}
      </View>
      <View style={styles.divider} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor="#fff" translucent/>
            <Seperator height={StatusBar.currentHeight}/>
      <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Preferences</Text>
        </View>
      <ScrollView style={styles.scrollView}>
        

        <View style={styles.content}>
          {renderSection('Your Dietary', [
            'Vegan',
            'Keto',
            'Low-sugar',
            'Non-vegetarian',
            'Pescatarian',
          ], 'dietary')}
          
          {renderSection(
            'Your Cuisine Preferences',
            ['Italian', 'Mexican', 'Indian', 'Chinese', 'Arabian'],
            'cuisine',
            'column'
          )}
          
          {renderSection(
            'Your Spice Level',
            ['Mild', 'Medium', 'Hot / Spicy'],
            'spiceLevel'
          )}
          
          {renderSection('Your Cooking Time', [
            'Under 15 mins',
            '15-30 mins',
            '30 - 60 mins',
            '1 hour or more',
          ], 'cookingTime')}
          
          {renderSection(
            'Your Culinary Skills',
            ['Beginner', 'Intermediate', 'Pro'],
            'culinarySkills'
          )}
          
          {renderSection('Food Allergies / Intolerances', [
            'Eggs',
            'Dairy',
            'Peanuts',
            'Soy',
          ], 'allergies')}

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
          >
            <Text style={styles.saveButtonText}>Save Preferences</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    backgroundColor: '#43018f',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  columnContainer: {
    flexDirection: 'column',
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 12,
    minWidth: '45%',
  },
  radioLabel: {
    marginLeft: 8,
    fontSize: 16,
    color: '#444',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginTop: 16,
  },
  saveButton: {
    backgroundColor: '#43018f',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default Preferences;