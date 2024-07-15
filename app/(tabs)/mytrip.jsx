import { View, Text } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../../constants/Colors'
import { Ionicons } from '@expo/vector-icons';
import StartNewWorkout from '../../components/MyWorkout/StartNewWorkout';

export default function mytrip() {

  const [userWorkout,setUserWorkout]=useState([]);

  return (
    <View style={{
      padding:25,
      paddingTop:55,
      backgroundColor:Colors.WHITE,
      height:'100%'
    }}>
      <View style={{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between'
      }}>
      <Text style={{
        fontFamily:'outfit-bold',
        fontSize:35
      }}>My Workout</Text>
      <Ionicons name="add-circle" size={50} color="black" />
      </View>

      {userWorkout?.length==0?
      <StartNewWorkout/>
      :null
      }




    </View>
  )
}