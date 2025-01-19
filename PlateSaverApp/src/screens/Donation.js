import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  StatusBar,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import * as Location from "expo-location";
import DateTimePicker from "@react-native-community/datetimepicker";
import { General } from "../constants";
import UserDonations from "../components/UserDonations";
import { Seperator } from "../components";

const Donation = () => {
  const { user, isLoaded } = useUser();
  const [location, setLocation] = useState(null);
  const [foodDetails, setFoodDetails] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [allergyInfo, setAllergyInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission Denied", "Permission to access location was denied.");
          setError("Permission to access location was denied.");
        }
      } catch (error) {
        Alert.alert("Error", "Failed to request location permission.");
      }
    })();
  }, []);

  const handleGetLocation = async () => {
    setLoading(true);
    try {
      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setError("");
    } catch (error) {
      setError("Unable to fetch location. Please enable location services.");
    } finally {
      setLoading(false);
    }
  };

  const handleDonate = async () => {
    if (!foodDetails.trim()) {
      setError("Please provide details about the food.");
      return;
    }
    if (!quantity.trim()) {
      setError("Please specify the quantity.");
      return;
    }
    if (!expiryDate) {
      setError("Please provide the expiry date.");
      return;
    }
    if (!location) {
      setError("Please allow location access to proceed.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${General.API_BASE_URL}api/donate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user?.id || "Anonymous",
          foodDetails,
          quantity,
          expiryDate: expiryDate.toISOString().split("T")[0],
          allergyInfo,
          location,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit donation.");
      }

      setSuccess(true);
      setRefreshCounter(prev => prev + 1);
      
      setFoodDetails("");
      setQuantity("");
      setExpiryDate(new Date());
      setAllergyInfo("");
      setLocation(null);
    } catch (err) {
      setError("Failed to submit donation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" translucent />
      <Seperator height={StatusBar.currentHeight} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>Donate Leftover Food</Text>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Food Details (E.g., Meals with fish curry)"
            value={foodDetails}
            onChangeText={setFoodDetails}
          />

          <TextInput
            style={styles.input}
            placeholder="Quantity (E.g., 5 Boxes)"
            value={quantity}
            onChangeText={setQuantity}
          />

          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.input}>
            <Text>{expiryDate.toDateString()}(Expiry date)</Text>
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={expiryDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) setExpiryDate(selectedDate);
              }}
            />
          )}

          <TextInput
            style={styles.input}
            placeholder="Allergy Information (Optional)"
            value={allergyInfo}
            onChangeText={setAllergyInfo}
          />

          <TouchableOpacity
            style={[styles.button, { backgroundColor: "green" }]}
            onPress={handleGetLocation}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonText}>Add Location</Text>
            )}
          </TouchableOpacity>

          {location && (
            <Text style={styles.locationText}>
              Location detected, Now you can donate your food.
              <Text style={styles.disclaimerText}>{'\n'}Note: This donation cannot be edited after submission.</Text>
            </Text>
          )}

          <TouchableOpacity 
            style={[
              styles.button, 
              { backgroundColor: loading || !location ? '#cccccc' : '#FF6B6B' },
              { opacity: loading || !location ? 0.6 : 1 }
            ]}
            onPress={handleDonate}
            disabled={loading || !location}
          >
            {loading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.buttonText}>Donate Food</Text>
            )}
          </TouchableOpacity>

          {error ? <Text style={{ color: "red", marginTop: 10 }}>{error}</Text> : null}

          {success &&
            Alert.alert(
              "Success",
              "Donation submitted successfully!",
              [
                { 
                  text: "OK",
                  onPress: () => {
                    setSuccess(false);
                  }
                }
              ],
              { cancelable: false }
            )
          }
          
          <UserDonations refreshTrigger={refreshCounter} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#212529",
  },
  input: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DEE2E6",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    color: "#495057",
  },
  button: {
    width: "100%",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  locationText: {
    marginBottom: 15,
    color: "#28A745",
    fontSize: 14,
    textAlign: "center",
  },
  disclaimerText: {
    color: "#DC3545",
    fontSize: 12,
    fontWeight: "500",
  },
  errorText: {
    color: "#DC3545",
    marginTop: 10,
    marginBottom: 15,
    fontSize: 14,
    textAlign: "center",
  }
});

export default Donation;