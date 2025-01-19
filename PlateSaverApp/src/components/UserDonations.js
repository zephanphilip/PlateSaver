import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Linking,
  Dimensions,
} from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { General } from "../constants";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.85;

const UserDonations = ({ refreshTrigger }) => {
  const { user, isLoaded } = useUser();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserDonations();
    }
  }, [isLoaded, user, refreshTrigger]);

  const fetchUserDonations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${General.API_BASE_URL}api/donate/${user.id}`
      );
      if (!response.ok) throw new Error("Failed to fetch donations.");
      const data = await response.json();
      setDonations(data.donations);
    } catch (err) {
      setError(err.message || "An error occurred while fetching donations.");
    } finally {
      setLoading(false);
    }
  };

  const openMap = (latitude, longitude) => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    Linking.openURL(url).catch(() => {
      alert("Unable to open the map.");
    });
  };

  const renderItem = ({ item }) => (
    <View style={styles.donationItem}>
      <View style={styles.statusBadge}>
        <Text style={[
          styles.statusText,
          { color: item.isAccepted ? "#2ECC71" : "#F1C40F" }
        ]}>
          {item.isAccepted ? "Accepted" : "Pending"}
        </Text>
      </View>

      <Text style={styles.foodDetails}>{item.foodDetails}</Text>
      
      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Quantity:</Text>
          <Text style={styles.value}>{item.quantity}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Expiry Date:</Text>
          <Text style={styles.value}>
            {new Date(item.expiryDate).toLocaleDateString()}
          </Text>
        </View>

        {item.allergyInfo && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Allergy Info:</Text>
            <Text style={styles.value}>{item.allergyInfo}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={styles.mapButton}
        onPress={() => openMap(item.location.latitude, item.location.longitude)}
      >
        <Text style={styles.mapButtonText}>View Location</Text>
      </TouchableOpacity>

      {item.isAccepted && item.recipient && (
        <View style={styles.recipientDetails}>
          <Text style={styles.recipientTitle}>Recipient Details</Text>
          <View style={styles.recipientInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{item.recipient.name || "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Phone:</Text>
              <Text style={styles.value}>{item.recipient.phoneNumber || "N/A"}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Accepted:</Text>
              <Text style={styles.value}>
                {item.recipient.acceptedAt
                  ? new Date(item.recipient.acceptedAt).toLocaleDateString()
                  : "N/A"}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity 
          style={styles.retryButton}
          onPress={fetchUserDonations}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Donations</Text>
      </View>

      {donations.length === 0 ? (
        <View style={[styles.container, styles.center]}>
          <Text style={styles.emptyText}>You have no active donations.</Text>
        </View>
      ) : (
        <FlatList
          data={donations}
          horizontal
          renderItem={renderItem}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={styles.listContent}
          showsHorizontalScrollIndicator={false}
          snapToInterval={CARD_WIDTH + 20}
          decelerationRate="fast"
          pagingEnabled
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#212529",
  },
  donationItem: {
    width: CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 10,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: "#F8F9FA",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  foodDetails: {
    fontSize: 20,
    fontWeight: "700",
    color: "#212529",
    marginBottom: 16,
    marginTop: 8,
  },
  infoContainer: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: "#6C757D",
    fontWeight: "500",
  },
  value: {
    fontSize: 14,
    color: "#212529",
    fontWeight: "500",
  },
  mapButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 16,
  },
  mapButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  recipientDetails: {
    backgroundColor: "#F8F9FA",
    borderRadius: 12,
    padding: 16,
  },
  recipientTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 12,
  },
  recipientInfo: {
    gap: 8,
  },
  errorText: {
    fontSize: 16,
    color: "#DC3545",
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyText: {
    fontSize: 16,
    color: "#6C757D",
    textAlign: "center",
  },
  listContent: {
    paddingVertical: 16,
    paddingHorizontal: 10,
  },
});

export default UserDonations;