import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import { Images } from '../constants'
import { useNavigation } from '@react-navigation/native';

export default function MainOptions() {
  const navigation = useNavigation();
  return (
   <View style={styles.preferencesContainer}>
           <TouchableOpacity style={styles.preferenceButton} activeOpacity={0.7} onPress={() => navigation.navigate('Preferences')}>
             <View style={styles.iconCircle}>
               <Image 
                 source={Images.preference}
                 style={styles.preferenceIcon}
               />
             </View>
             <Text style={styles.preferenceText}>Change your{'\n'}Preferences</Text>
           </TouchableOpacity>
   
           <TouchableOpacity style={styles.preferenceButton} activeOpacity={0.7} onPress={() => navigation.navigate('Donation')}>
             <View style={styles.iconCircle}>
               <Image 
                 source={Images.donation}
                 style={styles.preferenceIcon}
               />
             </View>
             <Text style={styles.preferenceText}>Donate your{'\n'}LeftOver</Text>
           </TouchableOpacity>
         </View>
  )
}

const styles = StyleSheet.create({
    preferencesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
        paddingHorizontal:15
      },
      preferenceButton: {
        backgroundColor: '#FFE5E5',
        padding: 16,
        borderRadius: 16,
        width: '48%',
        alignItems: 'center',
      },
      iconCircle: {
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 30,
        marginBottom: 8,
      },
      preferenceIcon: {
        width: 34,
        height: 34,
      },
      preferenceText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
      },
})