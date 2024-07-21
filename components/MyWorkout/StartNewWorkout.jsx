import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/Colors';
import { router, useRouter } from 'expo-router';
export default function StartNewWorkout() {

  const router=useRouter();
  return (
    <View style={{
        padding:20,
        marginTop:50,
        display:'flex',
        alignItems:'center',
        gap:25
    }}>
      <Ionicons name="close" size={30} color="black" />
      <Text style={{
        fontFamily:'outfit-medium',
        fontSize:25
      }}
      >No workout planned yet</Text>
      <Text style={{
        fontFamily:'outfit',
        fontSize:20,
        textAlign:'center',
        color:Colors.GRAY
      }}
      >Time to plan a new workout! Get started below</Text>

      <TouchableOpacity
      onPress={()=>router.push('/create-workout/search-place')}
      style={{
        padding:15,
        backgroundColor:Colors.PRIMARY,
        borderRadius:15,
        paddingHorizontal:30
      }}>
        <Text style={{
            color:Colors.WHITE,
            fontFamily:'outfit-medium',
            fontSize:18
        }}>Start a new workout</Text></TouchableOpacity>
    </View>
  )
}