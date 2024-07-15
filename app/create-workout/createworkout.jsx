import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, useNavigation } from 'expo-router';
import { Colors } from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { SelectGoalList } from '../../constants/Options';
import OptionCard from '../../components/CreateWorkout/OptionCard';

export default function CreateWorkout() {
  const navigation = useNavigation();
  const [selectedGoal,setSelectedGoal]=useState();

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerTransparent: true,
      headerTitle: '',
    });
  }, []);

  return (
    <View
      style={{
        padding: 25,
        paddingTop: 75,
        backgroundColor: Colors.WHITE,
        height: '100%',
      }}
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={26} color="black" />
      </TouchableOpacity>

      <Text
        style={{
          fontSize: 40,
          fontFamily: 'outfit-bold',
          marginTop: 20,
        }}
      >
        Select Your Goal
      </Text>
      <Text
        style={{
          fontSize: 20,
          fontFamily: 'outfit-medium',
          marginTop: 20,
        }}
      >
        What you want to achieve
      </Text>

      <FlatList
        data={SelectGoalList}
        renderItem={({ item ,index}) => (
          <TouchableOpacity 
          onPress={()=>setSelectedGoal(item.title)}
          style={{
            marginVertical:10
          }}>
          <OptionCard option={item} selectedGoal={selectedGoal}/>
          </TouchableOpacity>
        )}
        
      />
    </View>
  );
}
