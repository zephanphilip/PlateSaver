import { View, StyleSheet, SafeAreaView, Image, Text, Dimensions } from 'react-native';
import React from 'react';
import { Display } from '../utils';
import { Images } from '../constants';

const { width } = Dimensions.get('window');

export default function WelcomeCard({ title, content, image }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image 
            style={styles.image} 
            source={Images[image]} 
            resizeMode='contain'
          />
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.titleText}>{title}</Text>
          <View style={styles.separator} />
          <Text style={styles.contentText}>{content}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    width: Display.setWidth(100),
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 5,
    width: Display.setWidth(90),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 1,
   
  },
  image: {
    height: Display.setHeight(30),
    width: Display.setWidth(60),
   
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  titleText: {
    fontSize: 28,
    fontFamily: 'System',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 5,
    textAlign: 'center',
  },
  separator: {
    height: 2,
    width: 60,
    backgroundColor: '#FF6B6B',
    marginVertical: 15,
  },
  contentText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4a4a4a',
    textAlign: 'center',
    marginHorizontal: 10,
    fontFamily: 'System',
    marginBottom: 10,
  },
});