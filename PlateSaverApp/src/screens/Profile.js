import { View, Text, Image, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import React from 'react';
import { useUser } from '@clerk/clerk-expo';
import { useAuth } from '@clerk/clerk-react';
import { Seperator } from '../components';

export default function Profile() {
  const { user } = useUser();
  const { signOut } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
            <StatusBar barStyle='dark-content' backgroundColor="#fff" translucent/>
            <Seperator height={StatusBar.currentHeight}/>
      <View style={styles.profileHeader}>
        <Image
          style={styles.profileImage}
          source={{ uri: user?.imageUrl }}
        />
        <Text style={styles.userName}>Hello, {user?.fullName}!</Text>
        <Text style={styles.detailText}>{user?.emailAddresses[0].emailAddress}</Text>
      </View>

      <View style={styles.appHighlightSection}>
        <Text style={styles.sectionTitle}>About Plate Saver</Text>
        <Text style={styles.appDescription}>
          Plate Saver is your personal food management assistant, helping you reduce food waste. Manage your inventory, plan meals, and share excess food with those in need. Let's make a difference together!
        </Text>
      </View>

      <TouchableOpacity
        style={styles.signOutButton}
        onPress={async () => await signOut()}
      >
        <Text style={styles.signOutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE4E4',
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: '#FF6B6B',
  },
  userName: {
    marginTop: 15,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  detailText: {
    fontSize: 16,
    color: 'black',
  },
  appHighlightSection: {
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 20,
    marginBottom: 30,
    marginHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6B6B',
    marginBottom: 10,
  },
  appDescription: {
    fontSize: 16,
    color: '#FFE4E4',
    lineHeight: 22,
  },
  signOutButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal:10,
  },
  signOutButtonText: {
    color: '#FFE4E4',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
