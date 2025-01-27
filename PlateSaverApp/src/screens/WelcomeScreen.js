import { View, Text, StyleSheet, StatusBar, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useRef } from 'react';
import { General } from '../constants';
import { WelcomeCard, Seperator } from '../components';
import { Display } from '../utils';

const pageStyle = (isActive) =>
  isActive ? styles.activePage : styles.inactivePage;

const Pagination = ({ index }) => {
  return (
    <View style={styles.paginationContainer}>
      {[...Array(General.WELCOME_CONTENTS.length).keys()].map((_, i) => (
        <View style={pageStyle(i === index)} key={i} />
      ))}
    </View>
  );
};

export default function WelcomeScreen({ navigation }) {
  const [welcomeListIndex, setWelcomeListIndex] = useState(0);
  const welcomeList = useRef();
  const onViewRef = useRef(({ changed }) => {
    setWelcomeListIndex(changed[0].index);
  });
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const pageScroll = () => {
    welcomeList.current.scrollToIndex({
      index: welcomeListIndex < 2 ? welcomeListIndex + 1 : welcomeListIndex,
    });
  };

  const handlePress = () => {
    navigation.navigate('Auth');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.welcomeListContainer}>
        <FlatList
          data={General.WELCOME_CONTENTS}
          ref={welcomeList}
          keyExtractor={(item) => item.title}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          overScrollMode="never"
          viewabilityConfig={viewConfigRef.current}
          onViewableItemsChanged={onViewRef.current}
          renderItem={({ item }) => <WelcomeCard {...item} />}
        />
      </View>
      <Pagination index={welcomeListIndex} />
      {welcomeListIndex === 2 ? (
        <View style={styles.startButtonContainer}>
          <TouchableOpacity
            style={styles.startButton}
            activeOpacity={0.8}
            onPress={handlePress}
          >
            <Text style={styles.startButtonText}>Get Started</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={() => welcomeList.current.scrollToEnd()}>
            <Text style={styles.skipButton}>SKIP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton} onPress={pageScroll}>
            <Text style={styles.nextButtonText}>NEXT</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeListContainer: {
    height: Display.setHeight(60),
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  activePage: {
    height: 8,
    width: 20,
    backgroundColor: '#FF6B6B',
    borderRadius: 32,
    marginHorizontal: 5,
  },
  inactivePage: {
    height: 8,
    width: 8,
    backgroundColor: 'lightgrey',
    borderRadius: 32,
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: Display.setWidth(80),
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  startButtonContainer: {
    justifyContent: 'center',
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
  },
  skipButton: {
    color: 'grey',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#FFE4E4',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    elevation: 2,
  },
  nextButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FF6B6B',
  },
  startButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});
