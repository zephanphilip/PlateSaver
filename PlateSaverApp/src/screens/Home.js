import {  StyleSheet, SafeAreaView, StatusBar, FlatList, Text } from 'react-native';
import React, { useEffect } from 'react';
import { General } from '../constants';
import { Seperator,Header, TimelyRecipie, MainOptions, Menus } from '../components';
import { Display } from '../utils';
import { useUser } from '@clerk/clerk-expo';
import { checkExpiryAndNotify, registerForPushNotificationsAsync } from '../utils/notificationHelper';

export default function Home() {
   const { user, isLoaded } = useUser();
   useEffect(() => {
    if (isLoaded && user) {  // Only run if user is loaded and exists
      fetchItems();
      
      registerForPushNotificationsAsync();
    }
  }, [user, isLoaded]);

     // In your function where you fetch items
  const fetchItems = async () => {
    try {
      const response = await fetch(`${General.API_BASE_URL}api/items?userId=${user.id}`);
      const items = await response.json();
      
      // Check expiry and send notifications
      await checkExpiryAndNotify(items, user.primaryEmailAddress.emailAddress);
      
      // Update your state/UI with the items
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor="#fff" translucent/>
      <Seperator height={StatusBar.currentHeight}/>
      {/* Header Section */}
      <Header/>

      {/* Welcome Text */}
      <TimelyRecipie/>

      {/* Preference Buttons */}
      <MainOptions/>

      {/* Cook Like A Chef Section */}
      <Text style={styles.menuHead}>Our Delecios Menu</Text>
      <FlatList
      data={General.MENUS_CONTENTS}
      keyExtractor={item => item.name}
      vertical
      showsVerticalScrollIndicator={false}
      overScrollMode='never'
      renderItem={({item}) => <Menus {...item}/>}
      />
      <Seperator height={Display.setHeight(6)}/>
 </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
 menuHead: {
  fontSize: 22,
  fontWeight: 'bold',
  padding:15,
  textAlign: 'center',
},
});