import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React from 'react'
import { Images } from '../constants'
import { useUser } from '@clerk/clerk-expo'

export default function Header() {
  const {user} = useUser()
  return (
     <View style={styles.header}>
            <Text style={styles.logoText}>PlateSaver</Text>
            <Image 
                source={{uri:user?.imageUrl}}
                style={styles.profileIcon}
              />
          </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
    paddingHorizontal:15,
    paddingVertical:16
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FF6B6B',
  },
  notificationIcon: {
    width: 24,
    height: 24,
  },
  logoText: {
    fontSize: 26,
    fontWeight: 'bold',
    color:"#F05454"
  }
})