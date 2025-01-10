import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import { Images } from "../constants";
import { Display } from '../utils';
import { useNavigation } from '@react-navigation/native';

export default function Menus({name,desc,img,route}) {
  const navigation = useNavigation();
  return (
    <View style={styles.section}>
            <TouchableOpacity style={styles.card} activeOpacity={0.8} onPress={() => navigation.navigate(route)}>
              <Image 
                source={Images[img]}
                style={styles.image}
              />
              <View style={styles.textContainer}>
                <Text style={styles.title}>{name}</Text>
                <Text style={styles.description}>
                  {desc}.
                </Text>
              </View>
            </TouchableOpacity>
          </View>
  )
}
const styles = StyleSheet.create({
    section: {
        flex: 1,
        paddingHorizontal:15,
        marginBottom: 12,
      },
      card: {
        backgroundColor: '#F05454',
        borderRadius: 16,
        flexDirection: 'row',
        overflow: 'hidden',
        height: Display.setWidth(30)
      },
      image: {
        width: '40%',
        height: '100%',
      },
      textContainer: {
        flex: 1,
        padding: 16,
      },
      title: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 8,
      },
      description: {
        color: '#fff',
        fontSize: 14,
      
      },
})