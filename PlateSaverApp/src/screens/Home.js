import {  StyleSheet, SafeAreaView, StatusBar, FlatList, Text } from 'react-native';
import React from 'react';
import { General } from '../constants';
import { Seperator,Header, TimelyRecipie, MainOptions, Menus } from '../components';
import { Display } from '../utils';

export default function Home() {
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