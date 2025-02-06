import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, SafeAreaView, Image } from "react-native";
import React, {useEffect} from 'react'
import { Images } from "../constants";
import { Display } from "../utils";
import { useNavigation } from '@react-navigation/native';

export default function LoadScreen() {
      const navigation = useNavigation();
    useEffect(() => {
        setTimeout(() => {
          navigation.navigate('HomeScreen')
        },2000)
      },[])
  return (
    <SafeAreaView style={styles.outerContainer}>
         <StatusBar barStyle="dark-content"/>
         <View style={styles.container}>
         <Image
         source={Images.LOGO}
         resizeMode="contain"
         style={styles.image}
         />
         </View>
         <Text style={styles.text}>Loading</Text>
       </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
    },
    container: {
      alignItems: "center",
    },
    image:{
        height: Display.setHeight(30),
        width: Display.setWidth(30),
    },
    text:{
        textAlign: "center",
        position: "absolute",
        bottom: 40, // Adjust this value to control distance from bottom
        width: '100%'

    }
  });